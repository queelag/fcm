import { FetchError, setTimeout } from '@aracna/core'
import { ECDH, createECDH } from 'crypto'
import { Socket } from 'net'
import { TLSSocket, connect } from 'tls'
import {
  ACG_REGISTER_CHROME_VERSION,
  MCS_HEARTBEAT_PING_TIMEOUT_MS,
  MCS_SIZE_PACKET_MIN_LENGTH,
  MCS_TAG_PACKET_LENGTH,
  MCS_VERSION,
  MCS_VERSION_PACKET_LENGTH,
  MTALK_GOOGLE_HOST,
  MTALK_GOOGLE_PORT
} from '../definitions/constants.js'
import { MCSState, MCSTag } from '../definitions/enums.js'
import { FCMClientACG, FCMClientCrypto, FCMClientData } from '../definitions/interfaces.js'
import { ACGCheckinRequest, AndroidCheckinResponse } from '../index.js'
import { FCMLogger } from '../loggers/fcm-logger.js'
import { Close, DataMessageStanza, HeartbeatAck, HeartbeatPing, IqStanza, LoginRequest, LoginRequest_AuthService, LoginResponse } from '../protos/mcs.js'

export class FCMClient {
  acg: FCMClientACG
  crypto: FCMClientCrypto
  data: FCMClientData
  socket: TLSSocket

  constructor(acg: FCMClientACG, crypto: FCMClientCrypto) {
    this.acg = acg
    this.crypto = crypto
    this.data = {
      size: {
        expected: 0,
        received: 0
      },
      state: MCSState.VERSION_TAG_AND_SIZE,
      tag: MCSTag.LOGIN_RESPONSE,
      value: Buffer.alloc(0),
      version: 0
    }
    this.socket = new TLSSocket(new Socket())
  }

  async connect() {
    let checkin: AndroidCheckinResponse | FetchError

    checkin = await ACGCheckinRequest(this.acg.id, this.acg.securityToken)
    if (checkin instanceof Error) return

    this.socket = connect(MTALK_GOOGLE_PORT, MTALK_GOOGLE_HOST, { rejectUnauthorized: false })

    // this.socket.enableTrace()
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

  onHeartbeatPing = () => {
    let heartbeat: Uint8Array, buffer: Buffer

    heartbeat = HeartbeatPing.encode({
      streamId: this.data.heartbeat?.streamId ?? this.data.login?.streamId ?? 0,
      lastStreamIdReceived: this.data.heartbeat?.lastStreamIdReceived ?? this.data.login?.lastStreamIdReceived ?? 0,
      status: this.data.heartbeat?.status ?? 0n
    }).finish()
    FCMLogger.verbose('FCMClient', 'onHeartbeat', 'The heartbeat ping has been encoded.', heartbeat)

    buffer = Buffer.from([MCSTag.HEARTBEAT_PING, heartbeat.length, 1, ...heartbeat])
    FCMLogger.verbose('FCMClient', 'onHeartbeat', 'The heartbeat ping buffer is ready', buffer)

    this.socket.write(buffer)
    FCMLogger.info('FCMClient', 'onHeartbeat', 'HeartbeatPing', `The heartbeat ping has been sent.`)
  }

  onSocketClose = async (error: boolean) => {
    console.log('close', error)

    await this.connect()
    FCMLogger.info('FCMClient', 'onSocketClose', 'Reconnecting to the server.')
  }

  onSocketConnect = () => {
    console.log('connect')
  }

  onSocketData = (data: Buffer) => {
    this.data.value = Buffer.concat([this.data.value, data])
    FCMLogger.verbose('FCMClient', 'onSocketData', data, this.data.value)

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
        if (this.data.value.length < this.data.size.received + 1) {
          return
        }

        this.onSocketDataSize()

        break
      case MCSState.BYTES:
        if (this.data.value.length < this.data.size.expected) {
          return
        }

        this.onSocketDataBytes()

        break
      default:
        console.error('Unknown state', this.data.state)
        return
    }
  }

  onSocketDataVersion = () => {
    this.data.version = this.data.value.readUInt8(0)
    FCMLogger.info('FCMClient', 'onSocketDataVersion', this.data.version)

    if (this.data.version < MCS_VERSION) {
      this.socket.destroy(new Error('Unsupported MCS version'))
      FCMLogger.error('FCMClient', 'onSocketDataVersion', 'Unsupported MCS version', this.data.version)

      return
    }

    this.data.size.received++
    FCMLogger.verbose('FCMClient', 'onSocketDataVersion', `Increasing the received size by 1.`, [this.data.size.received])

    this.data.state = MCSState.TAG_AND_SIZE
    FCMLogger.info('FCMClient', 'onSocketDataVersion', `Setting state to TAG_AND_SIZE.`, [this.data.state])
  }

  onSocketDataTag = () => {
    this.data.tag = this.data.value.readUInt8(this.data.size.received)
    FCMLogger.info('FCMClient', 'onSocketDataTag', this.data.tag)

    this.data.size.received++
    FCMLogger.verbose('FCMClient', 'onSocketDataTag', `Increasing the received size by 1.`, [this.data.size.received])

    this.data.state = MCSState.SIZE
    FCMLogger.info('FCMClient', 'onSocketDataTag', `Setting state to SIZE.`, [this.data.state])
  }

  onSocketDataSize = () => {
    this.data.size.expected = this.data.value.readUInt8(this.data.size.received)
    FCMLogger.info('FCMClient', 'onSocketDataSize', this.data.size.expected)

    this.data.size.received++
    FCMLogger.verbose('FCMClient', 'onSocketDataSize', `Increasing the received size by 1.`, [this.data.size.received])

    this.data.state = MCSState.BYTES
    FCMLogger.info('FCMClient', 'onSocketDataSize', `Setting state to BYTES.`, [this.data.state])

    this.onSocketDataBytes()
  }

  onSocketDataBytes = () => {
    switch (this.data.tag) {
      case MCSTag.HEARTBEAT_ACK:
        let heartbeat: HeartbeatAck

        heartbeat = HeartbeatAck.decode(this.data.value.subarray(this.data.size.received, this.data.size.expected))
        FCMLogger.info('FCMClient', 'onSocketDataBytes', 'HEARTBEAT_ACK', `The bytes have been decoded.`, heartbeat)

        this.data.heartbeat = heartbeat
        FCMLogger.verbose('FCMClient', 'onSocketDataBytes', 'HEARTBEAT_ACK', `The heartbeat ack has been set inside data.`)

        setTimeout(this.onHeartbeatPing, MCS_HEARTBEAT_PING_TIMEOUT_MS)

        break
      case MCSTag.LOGIN_RESPONSE:
        let login: LoginResponse

        login = LoginResponse.decode(this.data.value.subarray(this.data.size.received, this.data.size.expected))
        FCMLogger.info('FCMClient', 'onSocketDataBytes', 'LOGIN_RESPONSE', `The bytes have been decoded.`, login)

        this.data.login = login
        FCMLogger.verbose('FCMClient', 'onSocketDataBytes', 'LOGIN_RESPONSE', `The login response has been set inside data.`)

        if (!login.error) {
          setTimeout(this.onHeartbeatPing, MCS_HEARTBEAT_PING_TIMEOUT_MS)
        }

        break
      case MCSTag.CLOSE:
        let close: Close

        close = Close.decode(this.data.value.subarray(this.data.size.received, this.data.size.expected))
        FCMLogger.info('FCMClient', 'onSocketDataBytes', 'CLOSE', `The bytes have been decoded.`, close)

        break
      // case MCSTag.MESSAGE_STANZA:
      //   break
      // case MCSTag.PRESENCE_STANZA:
      //   break
      case MCSTag.IQ_STANZA:
        let iq: IqStanza

        iq = IqStanza.decode(this.data.value.subarray(this.data.size.received, this.data.size.expected))
        FCMLogger.info('FCMClient', 'onSocketDataBytes', 'IQ_STANZA', `The bytes have been decoded.`, iq)

        break
      case MCSTag.DATA_MESSAGE_STANZA:
        let message: DataMessageStanza, ecdh: ECDH, data: Uint8Array

        message = DataMessageStanza.decode(this.data.value.subarray(this.data.size.received, this.data.size.expected))
        FCMLogger.info('FCMClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The bytes have been decoded.`, message)

        ecdh = createECDH('prime256v1')
        ecdh.setPrivateKey(this.crypto.privateKey)

        // data =

        break
      // case MCSTag.BATCH_PRESENCE_STANZA:
      //   break
      // case MCSTag.STREAM_ERROR_STANZA:
      //   break
      // case MCSTag.HTTP_RESPONSE:
      //   break
      // case MCSTag.BIND_ACCOUNT_RESPONSE:
      //   break
      // case MCSTag.TALK_METADATA:
      //   break
      // case MCSTag.NUM_PROTO_TYPES:
      //   break
    }

    this.data.size.expected = 0
    this.data.size.received = 0
    this.data.state = MCSState.TAG_AND_SIZE
    this.data.value = Buffer.alloc(0)
  }

  onSocketDrain = () => {
    console.log('drain')
  }

  onSocketEnd = () => {
    console.log('end')
  }

  onSocketError = (error: Error) => {
    console.log('error', error)
  }

  onSocketKeylog = (line: Buffer) => {
    console.log('keylog', line)
  }

  onSocketLookup = (error: Error, address: string, family: string, host: string) => {
    console.log('lookup', error, address, family, host)
  }

  onSocketOCSPResponse = (response: Buffer) => {
    console.log('OCSPResponse', response)
  }

  onSocketReady = () => {
    let login: Uint8Array, buffer: Buffer

    console.log('ready')

    login = LoginRequest.encode({
      accountId: 0n,
      adaptiveHeartbeat: false,
      authService: LoginRequest_AuthService.ANDROID_ID,
      authToken: this.acg.securityToken.toString(),
      clientEvent: [],
      deviceId: `android-${this.acg.id.toString(16)}`,
      domain: 'mcs.android.com',
      id: `chrome-${ACG_REGISTER_CHROME_VERSION}`,
      lastRmqId: 0n,
      networkType: 1,
      receivedPersistentId: [],
      resource: this.acg.id.toString(),
      setting: [{ name: 'new_vc', value: '1' }],
      status: 0n,
      user: this.acg.id.toString(),
      useRmq2: true
    }).finish()
    FCMLogger.verbose('FCMClient', 'onSocketReady', 'The login request has been encoded', login)

    buffer = Buffer.from([MCS_VERSION, MCSTag.LOGIN_REQUEST, login.length, 1, ...login])
    FCMLogger.verbose('FCMClient', 'onSocketReady', 'The login request buffer is ready.', buffer)

    this.socket.write(buffer)
    FCMLogger.info('FCMClient', 'onSocketReady', `The login request has been sent.`)
  }

  onSocketSecureConnect = () => {
    console.log('secureConnect')
  }

  onSocketSession = (session: Buffer) => {
    console.log('session', session)
  }

  onSocketTimeout = () => {
    console.log('timeout')
  }
}
