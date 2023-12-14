import { DeferredPromise, EventEmitter, FetchError, MemoryStorage, Storage, decodeText, encodeBase64, setTimeout, tc } from '@aracna/core'
import { ECDH, createECDH } from 'crypto'
import { decrypt } from 'http_ece'
import { Socket } from 'net'
import { ConnectionOptions, TLSSocket, connect } from 'tls'
import {
  ACG_REGISTER_CHROME_VERSION,
  DEFAULT_FCM_CLIENT_ACG,
  DEFAULT_FCM_CLIENT_DATA,
  DEFAULT_FCM_CLIENT_ECDH,
  FCM_CLIENT_STORAGE_KEY,
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
import { AcgCheckinResponse, FcmClientACG, FcmClientData, FcmClientECDH, FcmClientEvents, FcmClientMessageData } from '../definitions/interfaces.js'
import { MCS } from '../definitions/proto/mcs.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { MCSProto } from '../proto/mcs.js'
import { postAcgCheckin } from '../requests/acg-requests.js'
import { parseLong } from '../utils/long-utils.js'
import { decodeProtoType } from '../utils/proto-utils.js'

export class FcmClient extends EventEmitter<FcmClientEvents> {
  private acg: FcmClientACG
  private data: FcmClientData
  private ecdh: FcmClientECDH
  socket: TLSSocket
  private storage: Storage
  storageKey: string

  constructor(storage: Storage = MemoryStorage, storageKey: string = FCM_CLIENT_STORAGE_KEY) {
    super()

    this.acg = DEFAULT_FCM_CLIENT_ACG()
    this.ecdh = DEFAULT_FCM_CLIENT_ECDH()
    this.data = DEFAULT_FCM_CLIENT_DATA()
    this.socket = new TLSSocket(new Socket())
    this.storage = storage
    this.storageKey = storageKey
  }

  async connect(acg: FcmClientACG, ecdh: FcmClientECDH, options?: ConnectionOptions): Promise<void | FetchError | Error> {
    let copy: void | Error, checkin: AcgCheckinResponse | FetchError

    this.acg = acg
    this.ecdh = ecdh

    copy = await this.storage.copy(this.storageKey, this.data)
    if (copy instanceof Error) return copy

    checkin = await postAcgCheckin(this.acg.id, this.acg.securityToken)
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

  async disconnect(error?: Error): Promise<void> {
    let promise: DeferredPromise<void> = new DeferredPromise()

    await this.storage.set(this.storageKey, this.data, ['received'])
    ClassLogger.verbose('FcmClient', 'disconnect', 'The received pids have been stored.')

    if (this.socket.closed) {
      return
    }

    this.socket.on('close', () => promise.resolve())
    this.socket = this.socket.destroy(error)

    return promise.instance
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
      received_persistent_id: this.data.received.pids,
      resource: this.acg.id.toString(),
      setting: [{ name: 'new_vc', value: '1' }],
      status: parseLong(0n),
      user: this.acg.id.toString(),
      use_rmq2: true
    }
    ClassLogger.verbose('FcmClient', 'onSocketReady', 'The login request has been created.', request)

    encoded = MCSProto.LoginRequest.encodeDelimited(request).finish()
    ClassLogger.verbose('FcmClient', 'onSocketReady', 'The login request has been encoded', encoded)

    buffer = Buffer.from([MCS_VERSION, MCSTag.LOGIN_REQUEST, ...encoded])
    ClassLogger.verbose('FcmClient', 'onSocketReady', 'The login request buffer is ready.', buffer)

    this.socket.write(buffer)
    ClassLogger.info('FcmClient', 'onSocketReady', `The login request has been sent.`)
  }

  private heartbeat(): void {
    let ping: MCS.HeartbeatPing, encoded: Uint8Array, buffer: Buffer

    ping = {
      stream_id: this.data.heartbeat?.stream_id ?? this.data.login?.stream_id ?? 0,
      last_stream_id_received: this.data.heartbeat?.last_stream_id_received ?? this.data.login?.last_stream_id_received ?? 0,
      status: this.data.heartbeat?.status ?? parseLong(0n)
    }
    ClassLogger.verbose('FcmClient', 'onHeartbeat', 'The heartbeat ping has been created.', ping)

    encoded = MCSProto.HeartbeatPing.encodeDelimited(ping).finish()
    ClassLogger.verbose('FcmClient', 'onHeartbeat', 'The heartbeat ping has been encoded.', encoded)

    buffer = Buffer.from([MCSTag.HEARTBEAT_PING, ...encoded])
    ClassLogger.verbose('FcmClient', 'onHeartbeat', 'The heartbeat ping buffer is ready', buffer)

    this.socket.write(buffer)
    ClassLogger.info('FcmClient', 'onHeartbeat', 'HeartbeatPing', `The heartbeat ping has been sent.`)
  }

  private prepareForNextMessage(): void {
    this.data.cursor = 0
    this.data.size.packets = MCS_SIZE_PACKET_MIN_LENGTH
    this.data.state = MCSState.TAG_AND_SIZE
    this.data.value = Buffer.alloc(0)
  }

  private onSocketClose = (error: boolean): void => {
    if (error) {
      return ClassLogger.error('FcmClient', 'onSocketClose', 'The socket has been closed with errors.', [error])
    }

    ClassLogger.info('FcmClient', 'onSocketClose', 'The socket has been closed.')
  }

  private onSocketConnect = (): void => {
    ClassLogger.info('FcmClient', 'onSocketConnect', 'The socket has been connected.')
  }

  private onSocketData = (data: Buffer): void => {
    this.data.value = Buffer.concat([this.data.value, data])
    ClassLogger.verbose('FcmClient', 'onSocketData', data, this.data.value, [data.length, this.data.value.length])

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
        ClassLogger.warn('FcmClient', 'onSocketData', `This state is not handled.`, [this.data.state])
        return
    }
  }

  private onSocketDataVersion = (): void => {
    this.data.version = this.data.value.readUInt8(0)
    ClassLogger.info('FcmClient', 'onSocketDataVersion', this.data.version)

    if (this.data.version < MCS_VERSION) {
      this.socket.destroy(new Error('Unsupported MCS version'))
      ClassLogger.error('FcmClient', 'onSocketDataVersion', 'Unsupported MCS version', this.data.version)

      return
    }

    this.data.cursor++
    ClassLogger.verbose('FcmClient', 'onSocketDataVersion', `Increasing the cursor by 1.`, [this.data.cursor])

    this.data.state = MCSState.TAG_AND_SIZE
    ClassLogger.info('FcmClient', 'onSocketDataVersion', `Setting state to TAG_AND_SIZE.`, [this.data.state])
  }

  private onSocketDataTag = (): void => {
    this.data.tag = this.data.value.readUInt8(this.data.cursor)
    ClassLogger.info('FcmClient', 'onSocketDataTag', [this.data.tag, MCSTag[this.data.tag]])

    this.data.cursor++
    ClassLogger.verbose('FcmClient', 'onSocketDataTag', `Increasing the cursor by 1.`, [this.data.cursor])

    this.data.state = MCSState.SIZE
    ClassLogger.info('FcmClient', 'onSocketDataTag', `Setting state to SIZE.`, [this.data.state])
  }

  private onSocketDataSize = (): void => {
    let decodable: string | null | Error, decryptable: void | undefined | Error

    if (this.data.value.length - this.data.cursor < MCS_SIZE_PACKET_MIN_LENGTH) {
      ClassLogger.warn('FcmClient', 'onSocketDataSize', `Failed to read current message, not enough size packets.`)
      return
    }

    if (this.data.size.packets >= MCS_SIZE_PACKET_MAX_LENGTH) {
      this.prepareForNextMessage()
      ClassLogger.warn('FcmClient', 'onSocketDataBytes', `Failed to read current message, ready for the next one.`)

      return
    }

    switch (this.data.tag) {
      case MCSTag.HEARTBEAT_ACK:
        decodable = tc(
          () => MCSProto.HeartbeatAck.verify(MCSProto.HeartbeatAck.decode(this.data.value.subarray(this.data.cursor + this.data.size.packets))),
          false
        )
        break
      case MCSTag.LOGIN_RESPONSE:
        decodable = tc(
          () => MCSProto.LoginResponse.verify(MCSProto.LoginResponse.decode(this.data.value.subarray(this.data.cursor + this.data.size.packets))),
          false
        )
        break
      case MCSTag.CLOSE:
        decodable = tc(() => MCSProto.Close.verify(MCSProto.Close.decode(this.data.value.subarray(this.data.cursor + this.data.size.packets))), false)
        break
      case MCSTag.IQ_STANZA:
        decodable = tc(() => MCSProto.IqStanza.verify(MCSProto.IqStanza.decode(this.data.value.subarray(this.data.cursor + this.data.size.packets))), false)
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
            privateKey: createECDH('prime256v1').setPrivateKey(new Uint8Array(this.ecdh.privateKey)),
            salt: message.app_data.find((data: MCS.AppData) => data.key === 'encryption')?.value.slice(5),
            version: 'aesgcm'
          })
        }, false)

        break
      default:
        decodable = null
        break
    }

    if (decodable instanceof Error || typeof decodable === 'string' || decryptable instanceof Error) {
      this.data.size.packets++
      ClassLogger.verbose('FcmClient', 'onSocketDataSize', `Increasing the packets by 1.`, [this.data.size.packets])

      this.onSocketDataSize()
      ClassLogger.verbose('FcmClient', 'onSocketDataSize', `Failed to decode the message with current size and bytes.`)

      return
    }

    this.data.cursor += this.data.size.packets
    ClassLogger.verbose('FcmClient', 'onSocketDataSize', `Increasing the cursor by ${this.data.size.packets}.`, [this.data.cursor])

    this.data.state = MCSState.BYTES
    ClassLogger.info('FcmClient', 'onSocketDataSize', `Setting state to BYTES.`, [this.data.state])

    this.onSocketDataBytes()
  }

  private onSocketDataBytes = (): void => {
    switch (this.data.tag) {
      case MCSTag.HEARTBEAT_ACK:
        let heartbeat: MCS.HeartbeatAck

        heartbeat = decodeProtoType(MCSProto.HeartbeatAck, this.data.value.subarray(this.data.cursor))
        ClassLogger.info('FcmClient', 'onSocketDataBytes', 'HEARTBEAT_ACK', `The bytes have been decoded.`, heartbeat)

        this.emit('heartbeat', heartbeat)
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'HEARTBEAT_ACK', `The heartbeat event has been emitted.`)

        this.data.heartbeat = heartbeat
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'HEARTBEAT_ACK', `The heartbeat ack has been set inside data.`)

        setTimeout(this.heartbeat.bind(this), MCS_HEARTBEAT_PING_TIMEOUT_MS)

        break
      case MCSTag.LOGIN_RESPONSE:
        let login: MCS.LoginResponse

        login = decodeProtoType(MCSProto.LoginResponse, this.data.value.subarray(this.data.cursor))
        ClassLogger.info('FcmClient', 'onSocketDataBytes', 'LOGIN_RESPONSE', `The bytes have been decoded.`, login)

        if (login.error || login.last_stream_id_received !== 1) {
          ClassLogger.error('FcmClient', 'onSocketDataBytes', 'LOGIN_RESPONSE', `Failed to login.`)
          break
        }

        this.emit('login', login)
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'LOGIN_RESPONSE', `The login event has been emitted.`)

        this.data.login = login
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'LOGIN_RESPONSE', `The login response has been set inside data.`)

        this.data.received.pids = []
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'LOGIN_RESPONSE', `The received pids have been reset.`)

        this.storage.set(this.storageKey, this.data, ['received'])
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'LOGIN_RESPONSE', `The received pids have been stored.`)

        this.heartbeat()

        break
      case MCSTag.CLOSE:
        let close: MCS.Close

        close = decodeProtoType(MCSProto.Close, this.data.value.subarray(this.data.cursor))
        ClassLogger.info('FcmClient', 'onSocketDataBytes', 'CLOSE', `The bytes have been decoded.`, close)

        this.emit('close')
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'CLOSE', `The close event has been emitted.`)

        break
      case MCSTag.IQ_STANZA:
        let iq: MCS.IqStanza

        iq = decodeProtoType(MCSProto.IqStanza, this.data.value.subarray(this.data.cursor))
        ClassLogger.info('FcmClient', 'onSocketDataBytes', 'IQ_STANZA', `The bytes have been decoded.`, iq)

        this.emit('iq', iq)
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'IQ_STANZA', `The iq event has been emitted.`)

        break
      case MCSTag.DATA_MESSAGE_STANZA:
        let message: MCS.DataMessageStanza, ecdh: ECDH, decrypted: Buffer, data: FcmClientMessageData

        message = decodeProtoType(MCSProto.DataMessageStanza, this.data.value.subarray(this.data.cursor))
        ClassLogger.info('FcmClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The bytes have been decoded.`, message)

        this.emit('message', message)
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The message event has been emitted.`)

        this.data.received.pids.push(message.persistent_id)
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The persistent id has been pushed.`, this.data.received.pids)

        this.storage.set(this.storageKey, this.data, ['received'])
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The received pids have been stored.`)

        ecdh = createECDH('prime256v1')
        ecdh.setPrivateKey(new Uint8Array(this.ecdh.privateKey))

        decrypted = decrypt(Buffer.from(message.raw_data), {
          authSecret: encodeBase64(this.ecdh.salt),
          dh: message.app_data.find((data: MCS.AppData) => data.key === 'crypto-key')?.value.slice(3),
          privateKey: ecdh,
          salt: message.app_data.find((data: MCS.AppData) => data.key === 'encryption')?.value.slice(5),
          version: 'aesgcm'
        })
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The message data has been decrypted.`, decrypted)

        data = JSON.parse(decodeText(decrypted))
        ClassLogger.info('FcmClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The message data has been parsed.`, data)

        this.emit('message-data', data)
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The message event has been emitted.`)

        break
      default:
        ClassLogger.warn('FcmClient', 'onSocketDataBytes', `This tag is not handled.`, [this.data.tag, MCSTag[this.data.tag]])
        break
    }

    this.prepareForNextMessage()
    ClassLogger.verbose('FcmClient', 'onSocketDataBytes', `Ready for the next message.`)
  }

  private onSocketDrain = (): void => {
    ClassLogger.verbose('FcmClient', 'onSocketDrain', 'The socket has been drained.')
  }

  private onSocketEnd = (): void => {
    ClassLogger.info('FcmClient', 'onSocketEnd', 'The socket connection has ended.')
  }

  private onSocketError = (error: Error): void => {
    ClassLogger.error('FcmClient', 'onSocketError', error)
  }

  private onSocketKeylog = (line: Buffer): void => {
    ClassLogger.verbose('FcmClient', 'onSocketKeylog', line)
  }

  private onSocketLookup = (error: Error, address: string, family: string, host: string): void => {
    ClassLogger.verbose('FcmClient', 'onSocketLookup', [error, address, family, host])
  }

  private onSocketOCSPResponse = (response: Buffer): void => {
    ClassLogger.verbose('FcmClient', 'onSocketOCSPResponse', response)
  }

  private onSocketReady = (): void => {
    ClassLogger.info('FcmClient', 'onSocketReady', 'The socket is ready.')

    this.login()
    ClassLogger.verbose('FcmClient', 'onSocketReady', 'The login request has been sent.')
  }

  private onSocketSecureConnect = (): void => {
    ClassLogger.verbose('FcmClient', 'onSocketSecureConnect', 'The socket has been securely connected.')
  }

  private onSocketSession = (session: Buffer): void => {
    ClassLogger.verbose('FcmClient', 'onSocketSession', session)
  }

  private onSocketTimeout = (): void => {
    ClassLogger.warn('FcmClient', 'onSocketTimeout', 'The socket has timed out.')
  }
}
