import { FetchError, decodeText, encodeBase64, setTimeout, tc } from '@aracna/core'
import { ECDH, createECDH } from 'crypto'
import EventEmitter from 'events'
import { decrypt } from 'http_ece'
import { Socket } from 'net'
import { ConnectionOptions, TLSSocket, connect } from 'tls'
import {
  ACG_REGISTER_CHROME_VERSION,
  MCS_HEARTBEAT_PING_TIMEOUT_MS,
  MCS_SIZE_PACKET_MAX_LENGTH,
  MCS_SIZE_PACKET_MIN_LENGTH,
  MCS_TAG_PACKET_LENGTH,
  MCS_VERSION,
  MCS_VERSION_PACKET_LENGTH,
  MTALK_GOOGLE_HOST,
  MTALK_GOOGLE_PORT
} from '../definitions/constants.js'
import { MCSState, MCSTag } from '../definitions/enums.js'
import { ACGCheckinResponse, FCMClientACG, FCMClientData, FCMClientECDH, MessageData } from '../definitions/interfaces.js'
import { MCS } from '../definitions/proto/mcs.js'
import { FCMClientEventName } from '../definitions/types.js'
import { FCMLogger } from '../loggers/fcm-logger.js'
import { MCSProto } from '../proto/mcs.js'
import { postACGCheckin } from '../requests/acg-requests.js'
import { parseLong } from '../utils/long-utils.js'
import { decodeProtoType } from '../utils/proto-utils.js'

export class FCMClient extends EventEmitter {
  private acg: FCMClientACG
  private data: FCMClientData
  private ecdh: FCMClientECDH
  socket: TLSSocket

  constructor(acg: FCMClientACG, ecdh: FCMClientECDH) {
    super()

    this.acg = acg
    this.ecdh = ecdh
    this.data = {
      cursor: 0,
      size: { packets: MCS_SIZE_PACKET_MIN_LENGTH },
      state: MCSState.VERSION_TAG_AND_SIZE,
      tag: MCSTag.LOGIN_RESPONSE,
      value: Buffer.alloc(0),
      version: 0
    }
    this.socket = new TLSSocket(new Socket())
  }

  async connect(options?: ConnectionOptions): Promise<void | FetchError> {
    let checkin: ACGCheckinResponse | FetchError

    checkin = await postACGCheckin(this.acg.id, this.acg.securityToken)
    if (checkin instanceof Error) return checkin

    this.socket = connect(MTALK_GOOGLE_PORT, MTALK_GOOGLE_HOST, { rejectUnauthorized: false, ...options })
    this.socket.setKeepAlive(true)

    this.socket.on('close', this.onSocketClose)
    this.socket.on('connect', this.onSocketConnect)
    this.socket.on('data', this.onSocketData)
    this.socket.on('drain', this.onSocketDrain)
    this.socket.on('end', this.onSocketEnd)
    this.socket.on('error', this.onSocketError)
    this.socket.on('lookup', this.onSocketLookup)
    this.socket.on('ready', this.onSocketReady)
    this.socket.on('timeout', this.onSocketTimeout)

    this.socket.on('keylog', this.onSocketKeylog)
    this.socket.on('OCSPResponse', this.onSocketOCSPResponse)
    this.socket.on('secureConnect', this.onSocketSecureConnect)
    this.socket.on('session', this.onSocketSession)
  }

  private login(): void {
    let request: MCS.LoginRequest, encoded: Uint8Array, buffer: Buffer

    request = {
      account_id: parseLong(0n),
      adaptive_heartbeat: false,
      auth_service: MCS.LoginRequestAuthService.ANDROID_ID,
      auth_token: this.acg.securityToken.toString(),
      client_event: [],
      device_id: `android-${this.acg.id.toString(16)}`,
      domain: 'mcs.android.com',
      heartbeat_stat: undefined,
      id: `chrome-${ACG_REGISTER_CHROME_VERSION}`,
      last_rmq_id: parseLong(0n),
      network_type: 1,
      received_persistent_id: [],
      resource: this.acg.id.toString(),
      setting: [{ name: 'new_vc', value: '1' }],
      status: parseLong(0n),
      user: this.acg.id.toString(),
      use_rmq2: true
    }
    FCMLogger.verbose('FCMClient', 'onSocketReady', 'The login request has been created.', request)

    encoded = MCSProto.LoginRequest.encodeDelimited(request).finish()
    FCMLogger.verbose('FCMClient', 'onSocketReady', 'The login request has been encoded', encoded)

    buffer = Buffer.from([MCS_VERSION, MCSTag.LOGIN_REQUEST, ...encoded])
    FCMLogger.verbose('FCMClient', 'onSocketReady', 'The login request buffer is ready.', buffer)

    this.socket.write(buffer)
    FCMLogger.info('FCMClient', 'onSocketReady', `The login request has been sent.`)
  }

  private heartbeat(): void {
    let ping: MCS.HeartbeatPing, encoded: Uint8Array, buffer: Buffer

    ping = {
      stream_id: this.data.heartbeat?.stream_id ?? this.data.login?.stream_id ?? 0,
      last_stream_id_received: this.data.heartbeat?.last_stream_id_received ?? this.data.login?.last_stream_id_received ?? 0,
      status: this.data.heartbeat?.status ?? parseLong(0n)
    }
    FCMLogger.verbose('FCMClient', 'onHeartbeat', 'The heartbeat ping has been created.', ping)

    encoded = MCSProto.HeartbeatPing.encodeDelimited(ping).finish()
    FCMLogger.verbose('FCMClient', 'onHeartbeat', 'The heartbeat ping has been encoded.', encoded)

    buffer = Buffer.from([MCSTag.HEARTBEAT_PING, ...encoded])
    FCMLogger.verbose('FCMClient', 'onHeartbeat', 'The heartbeat ping buffer is ready', buffer)

    this.socket.write(buffer)
    FCMLogger.info('FCMClient', 'onHeartbeat', 'HeartbeatPing', `The heartbeat ping has been sent.`)
  }

  private onSocketClose = (error: boolean): void => {
    FCMLogger.warn('FCMClient', 'onSocketClose', 'The socket has been closed.', [error])
  }

  private onSocketConnect = (): void => {
    FCMLogger.info('FCMClient', 'onSocketConnect', 'The socket has been connected.')
  }

  private onSocketData = (data: Buffer): void => {
    this.data.value = Buffer.concat([this.data.value, data])
    FCMLogger.verbose('FCMClient', 'onSocketData', data, this.data.value, [data.length, this.data.value.length])

    switch (this.data.state) {
      case MCSState.VERSION_TAG_AND_SIZE:
        if (this.data.value.length < MCS_VERSION_PACKET_LENGTH + MCS_TAG_PACKET_LENGTH + MCS_SIZE_PACKET_MIN_LENGTH) {
          return
        }

        this.onSocketDataVersion()
        this.onSocketDataTag()
        this.onSocketDataSize()

        break
      case MCSState.TAG_AND_SIZE:
        if (this.data.value.length < MCS_TAG_PACKET_LENGTH + MCS_SIZE_PACKET_MIN_LENGTH) {
          return
        }

        this.onSocketDataTag()
        this.onSocketDataSize()

        break
      case MCSState.SIZE:
        this.onSocketDataSize()
        break
      case MCSState.BYTES:
        this.onSocketDataBytes()
        break
      default:
        FCMLogger.warn('FCMClient', 'onSocketData', `This state is not handled.`, [this.data.state])
        return
    }
  }

  private onSocketDataVersion = (): void => {
    this.data.version = this.data.value.readUInt8(0)
    FCMLogger.info('FCMClient', 'onSocketDataVersion', this.data.version)

    if (this.data.version < MCS_VERSION) {
      this.socket.destroy(new Error('Unsupported MCS version'))
      FCMLogger.error('FCMClient', 'onSocketDataVersion', 'Unsupported MCS version', this.data.version)

      return
    }

    this.data.cursor++
    FCMLogger.verbose('FCMClient', 'onSocketDataVersion', `Increasing the cursor by 1.`, [this.data.cursor])

    this.data.state = MCSState.TAG_AND_SIZE
    FCMLogger.info('FCMClient', 'onSocketDataVersion', `Setting state to TAG_AND_SIZE.`, [this.data.state])
  }

  private onSocketDataTag = (): void => {
    this.data.tag = this.data.value.readUInt8(this.data.cursor)
    FCMLogger.info('FCMClient', 'onSocketDataTag', [this.data.tag, MCSTag[this.data.tag]])

    this.data.cursor++
    FCMLogger.verbose('FCMClient', 'onSocketDataTag', `Increasing the cursor by 1.`, [this.data.cursor])

    this.data.state = MCSState.SIZE
    FCMLogger.info('FCMClient', 'onSocketDataTag', `Setting state to SIZE.`, [this.data.state])
  }

  private onSocketDataSize = (): void => {
    let decodable: string | null | Error, decryptable: void | Error

    if (this.data.value.length - this.data.cursor < MCS_SIZE_PACKET_MIN_LENGTH) {
      FCMLogger.warn('FCMClient', 'onSocketDataSize', `Failed to read current message, not enough size packets.`)
      return
    }

    if (this.data.size.packets >= MCS_SIZE_PACKET_MAX_LENGTH) {
      this.data.cursor = 0
      this.data.size.packets = MCS_SIZE_PACKET_MIN_LENGTH
      this.data.state = MCSState.TAG_AND_SIZE
      this.data.value = Buffer.alloc(0)

      FCMLogger.warn('FCMClient', 'onSocketDataBytes', `Failed to read current message, ready for the next one.`)
      return
    }

    switch (this.data.tag) {
      case MCSTag.HEARTBEAT_ACK:
        decodable = tc(
          () => MCSProto.HeartbeatAck.verify(MCSProto.HeartbeatAck.decode(this.data.value.subarray(this.data.cursor + this.data.size.packets))),
          false
        )
        decryptable = undefined

        break
      case MCSTag.LOGIN_RESPONSE:
        decodable = tc(
          () => MCSProto.LoginResponse.verify(MCSProto.LoginResponse.decode(this.data.value.subarray(this.data.cursor + this.data.size.packets))),
          false
        )
        decryptable = undefined

        break
      case MCSTag.CLOSE:
        decodable = tc(() => MCSProto.Close.verify(MCSProto.Close.decode(this.data.value.subarray(this.data.cursor + this.data.size.packets))), false)
        decryptable = undefined

        break
      case MCSTag.IQ_STANZA:
        decodable = tc(() => MCSProto.IqStanza.verify(MCSProto.IqStanza.decode(this.data.value.subarray(this.data.cursor + this.data.size.packets))), false)
        decryptable = undefined

        break
      case MCSTag.DATA_MESSAGE_STANZA:
        decodable = tc(
          () => MCSProto.DataMessageStanza.verify(MCSProto.DataMessageStanza.decode(this.data.value.subarray(this.data.cursor + this.data.size.packets))),
          false
        )

        decryptable = tc(() => {
          let message: MCS.DataMessageStanza = decodeProtoType(MCSProto.DataMessageStanza, this.data.value.subarray(this.data.cursor + this.data.size.packets))

          decrypt(Buffer.from(message.raw_data), {
            authSecret: encodeBase64(this.ecdh.salt),
            dh: message.app_data.find((data: MCS.AppData) => data.key === 'crypto-key')?.value.slice(3),
            privateKey: createECDH('prime256v1').setPrivateKey(this.ecdh.privateKey),
            salt: message.app_data.find((data: MCS.AppData) => data.key === 'encryption')?.value.slice(5),
            version: 'aesgcm'
          })
        }, false)

        break
      default:
        decodable = null
        decryptable = undefined

        break
    }

    if (decodable instanceof Error || typeof decodable === 'string' || decryptable instanceof Error) {
      this.data.size.packets++
      FCMLogger.verbose('FCMClient', 'onSocketDataSize', `Increasing the packets by 1.`, [this.data.size.packets])

      this.onSocketDataSize()
      FCMLogger.verbose('FCMClient', 'onSocketDataSize', `Failed to decode the message with current size and bytes.`)

      return
    }

    this.data.cursor += this.data.size.packets
    FCMLogger.verbose('FCMClient', 'onSocketDataSize', `Increasing the cursor by ${this.data.size.packets}.`, [this.data.cursor])

    this.data.state = MCSState.BYTES
    FCMLogger.info('FCMClient', 'onSocketDataSize', `Setting state to BYTES.`, [this.data.state])

    this.onSocketDataBytes()
  }

  private onSocketDataBytes = (): void => {
    switch (this.data.tag) {
      case MCSTag.HEARTBEAT_ACK:
        let heartbeat: MCS.HeartbeatAck

        heartbeat = decodeProtoType(MCSProto.HeartbeatAck, this.data.value.subarray(this.data.cursor))
        FCMLogger.info('FCMClient', 'onSocketDataBytes', 'HEARTBEAT_ACK', `The bytes have been decoded.`, heartbeat)

        this.emit('heartbeat', heartbeat)
        FCMLogger.verbose('FCMClient', 'onSocketDataBytes', 'HEARTBEAT_ACK', `The heartbeat event has been emitted.`)

        this.data.heartbeat = heartbeat
        FCMLogger.verbose('FCMClient', 'onSocketDataBytes', 'HEARTBEAT_ACK', `The heartbeat ack has been set inside data.`)

        setTimeout(this.heartbeat.bind(this), MCS_HEARTBEAT_PING_TIMEOUT_MS)

        break
      case MCSTag.LOGIN_RESPONSE:
        let login: MCS.LoginResponse

        login = decodeProtoType(MCSProto.LoginResponse, this.data.value.subarray(this.data.cursor))
        FCMLogger.info('FCMClient', 'onSocketDataBytes', 'LOGIN_RESPONSE', `The bytes have been decoded.`, login)

        if (login.error || login.last_stream_id_received !== 1) {
          FCMLogger.error('FCMClient', 'onSocketDataBytes', 'LOGIN_RESPONSE', `Failed to login.`)
          break
        }

        this.emit('login', login)
        FCMLogger.verbose('FCMClient', 'onSocketDataBytes', 'LOGIN_RESPONSE', `The login event has been emitted.`)

        this.data.login = login
        FCMLogger.verbose('FCMClient', 'onSocketDataBytes', 'LOGIN_RESPONSE', `The login response has been set inside data.`)

        this.heartbeat()

        break
      case MCSTag.CLOSE:
        let close: MCS.Close

        close = decodeProtoType(MCSProto.Close, this.data.value.subarray(this.data.cursor))
        FCMLogger.info('FCMClient', 'onSocketDataBytes', 'CLOSE', `The bytes have been decoded.`, close)

        this.emit('close', close)
        FCMLogger.verbose('FCMClient', 'onSocketDataBytes', 'CLOSE', `The close event has been emitted.`)

        break
      case MCSTag.IQ_STANZA:
        let iq: MCS.IqStanza

        iq = decodeProtoType(MCSProto.IqStanza, this.data.value.subarray(this.data.cursor))
        FCMLogger.info('FCMClient', 'onSocketDataBytes', 'IQ_STANZA', `The bytes have been decoded.`, iq)

        this.emit('iq', iq)
        FCMLogger.verbose('FCMClient', 'onSocketDataBytes', 'IQ_STANZA', `The iq event has been emitted.`)

        break
      case MCSTag.DATA_MESSAGE_STANZA:
        let message: MCS.DataMessageStanza, ecdh: ECDH, decrypted: Buffer, data: MessageData

        message = decodeProtoType(MCSProto.DataMessageStanza, this.data.value.subarray(this.data.cursor))
        FCMLogger.info('FCMClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The bytes have been decoded.`, message)

        this.emit('message', message)
        FCMLogger.verbose('FCMClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The message event has been emitted.`)

        ecdh = createECDH('prime256v1')
        ecdh.setPrivateKey(this.ecdh.privateKey)

        decrypted = decrypt(Buffer.from(message.raw_data), {
          authSecret: encodeBase64(this.ecdh.salt),
          dh: message.app_data.find((data: MCS.AppData) => data.key === 'crypto-key')?.value.slice(3),
          privateKey: ecdh,
          salt: message.app_data.find((data: MCS.AppData) => data.key === 'encryption')?.value.slice(5),
          version: 'aesgcm'
        })

        FCMLogger.verbose('FCMClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The message data has been decrypted.`, decrypted)

        data = JSON.parse(decodeText(decrypted))
        FCMLogger.info('FCMClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The message data has been parsed.`, data)

        this.emit('message-data', data)
        FCMLogger.verbose('FCMClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The message event has been emitted.`)

        break
      default:
        FCMLogger.warn('FCMClient', 'onSocketDataBytes', `This tag is not handled.`, [this.data.tag, MCSTag[this.data.tag]])
        break
    }

    this.data.cursor = 0
    this.data.size.packets = MCS_SIZE_PACKET_MIN_LENGTH
    this.data.state = MCSState.TAG_AND_SIZE
    this.data.value = Buffer.alloc(0)

    FCMLogger.verbose('FCMClient', 'onSocketDataBytes', `Ready for a new message.`)
  }

  private onSocketDrain = (): void => {
    FCMLogger.verbose('FCMClient', 'onSocketDrain', 'The socket has been drained.')
  }

  private onSocketEnd = (): void => {
    FCMLogger.info('FCMClient', 'onSocketEnd', 'The socket connection has ended.')
  }

  private onSocketError = (error: Error): void => {
    FCMLogger.error('FCMClient', 'onSocketError', error)
  }

  private onSocketKeylog = (line: Buffer): void => {
    FCMLogger.verbose('FCMClient', 'onSocketKeylog', line)
  }

  private onSocketLookup = (error: Error, address: string, family: string, host: string): void => {
    FCMLogger.verbose('FCMClient', 'onSocketLookup', [error, address, family, host])
  }

  private onSocketOCSPResponse = (response: Buffer): void => {
    FCMLogger.verbose('FCMClient', 'onSocketOCSPResponse', response)
  }

  private onSocketReady = (): void => {
    FCMLogger.info('FCMClient', 'onSocketReady', 'The socket is ready.')

    this.login()
    FCMLogger.verbose('FCMClient', 'onSocketReady', 'The login request has been sent.')
  }

  private onSocketSecureConnect = (): void => {
    FCMLogger.verbose('FCMClient', 'onSocketSecureConnect', 'The socket has been securely connected.')
  }

  private onSocketSession = (session: Buffer): void => {
    FCMLogger.verbose('FCMClient', 'onSocketSession', session)
  }

  private onSocketTimeout = (): void => {
    FCMLogger.warn('FCMClient', 'onSocketTimeout', 'The socket has timed out.')
  }

  addListener(eventName: FCMClientEventName, listener: (...args: any[]) => void): this {
    return super.addListener(eventName, listener)
  }

  emit(eventName: FCMClientEventName, ...args: any[]): boolean {
    return super.emit(eventName, ...args)
  }

  listenerCount(eventName: FCMClientEventName, listener?: Function | undefined): number {
    return super.listenerCount(eventName, listener)
  }

  listeners(eventName: FCMClientEventName): Function[] {
    return super.listeners(eventName)
  }

  off(eventName: FCMClientEventName, listener: (...args: any[]) => void): this {
    return super.off(eventName, listener)
  }

  on(eventName: FCMClientEventName, listener: (...args: any[]) => void): this {
    return super.on(eventName, listener)
  }

  once(eventName: FCMClientEventName, listener: (...args: any[]) => void): this {
    return super.once(eventName, listener)
  }

  prependListener(eventName: FCMClientEventName, listener: (...args: any[]) => void): this {
    return super.prependListener(eventName, listener)
  }

  prependOnceListener(eventName: FCMClientEventName, listener: (...args: any[]) => void): this {
    return super.prependOnceListener(eventName, listener)
  }

  rawListeners(eventName: FCMClientEventName): Function[] {
    return super.rawListeners(eventName)
  }

  removeListener(eventName: FCMClientEventName, listener: (...args: any[]) => void): this {
    return super.removeListener(eventName, listener)
  }

  removeAllListeners(eventName?: FCMClientEventName): this {
    return super.removeAllListeners(eventName)
  }
}
