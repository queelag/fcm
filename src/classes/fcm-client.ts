import { DeferredPromise, EventEmitter, FetchError, MemoryStorage, Storage, clearTimeout, decodeText, encodeBase64, setTimeout, tc } from '@aracna/core'
import { ECDH, createECDH } from 'crypto'
import { decrypt } from 'http_ece'
import { ConnectionOptions, TLSSocket, connect } from 'tls'
import {
  ACG_REGISTER_CHROME_VERSION,
  DEFAULT_FCM_CLIENT_ACG,
  DEFAULT_FCM_CLIENT_DATA,
  DEFAULT_FCM_CLIENT_ECE,
  DEFAULT_FCM_CLIENT_HEARTBEAT_FREQUENCY,
  DEFAULT_FCM_CLIENT_STORAGE_KEY,
  FCM_ECDH_CURVE_NAME,
  MCS_SIZE_PACKET_MAX_LENGTH,
  MCS_SIZE_PACKET_MIN_LENGTH,
  MCS_SIZE_TIMEOUT,
  MCS_TAG_PACKET_LENGTH,
  MCS_VERSION,
  MCS_VERSION_PACKET_LENGTH,
  MTALK_GOOGLE_HOST,
  MTALK_GOOGLE_PORT
} from '../definitions/constants.js'
import { McsState, McsTag } from '../definitions/enums.js'
import {
  AcgCheckinResponse,
  FcmClientACG,
  FcmClientData,
  FcmClientECE,
  FcmClientEvents,
  FcmClientInit,
  FcmClientMessageData,
  FcmClientOptions
} from '../definitions/interfaces.js'
import { McsDefinitions } from '../definitions/proto/mcs-definitions.js'
import { ClassLogger } from '../loggers/class-logger.js'
import { MCSProto } from '../proto/mcs-proto.js'
import { postAcgCheckin } from '../requests/acg-requests.js'
import { parseLong } from '../utils/long-utils.js'
import { decodeProtoType } from '../utils/proto-utils.js'

/**
 * The FcmClient class establishes a TLS socket connection with Google MTalk and handles the communication.
 *
 * - The client needs a valid ACG ID and ACG security token to login, they can be obtained with the `registerToFCM` function.
 * - The client needs a valid ECE auth secret and ECE private key to decrypt the messages, they can be obtained with the `createFcmECDH` and `generateFcmSalt` functions.
 * - The client will store the received persistent IDs in the storage. By default the storage is an in-memory storage, it is reccomended to use a persistent storage.
 * - The client will perform a heartbeat every 5 seconds to avoid losing the socket connection.
 *
 * Events:
 *
 * - The client will emit a `close` event when a close message is received.
 * - The client will emit a `heartbeat` event when a heartbeat is received.
 * - The client will emit a `iq` event when an IQ stanza is received.
 * - The client will emit a `login` event when a login response is received.
 * - The client will emit a `message` event when a message is received.
 * - The client will emit a `message-data` event when a message is decrypted.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/fcm/classes/fcm-client)
 */
export class FcmClient extends EventEmitter<FcmClientEvents> {
  /**
   * The ACG object, contains the ACG ID and ACG security token.
   */
  protected readonly acg: FcmClientACG
  /**
   * The data object, contains all things relative to the exchange of messages.
   */
  protected data: FcmClientData
  /**
   * The ECE object, contains the auth secret and the ECDH private key.
   */
  protected readonly ece: FcmClientECE
  /**
   * The options object, contains the heartbeat frequency.
   */
  protected readonly options: FcmClientOptions
  /**
   * The TLS socket.
   */
  protected socket?: TLSSocket
  /**
   * The storage instance.
   */
  protected readonly storage: Storage
  /**
   * The storage key.
   */
  protected readonly storageKey: string

  constructor(init?: FcmClientInit) {
    super()

    this.acg = init?.acg ?? DEFAULT_FCM_CLIENT_ACG()
    this.ece = init?.ece ?? DEFAULT_FCM_CLIENT_ECE()
    this.data = DEFAULT_FCM_CLIENT_DATA()
    this.options = { heartbeat: { frequency: init?.heartbeat?.frequency ?? DEFAULT_FCM_CLIENT_HEARTBEAT_FREQUENCY } }
    this.storage = init?.storage?.instance ?? MemoryStorage
    this.storageKey = init?.storage?.key ?? DEFAULT_FCM_CLIENT_STORAGE_KEY
  }

  /**
   * Connects the socket to Google MTalk.
   *
   * - The persistent IDs received in the previous session will be retrieved from the storage to communicate them to the server during the login.
   * - The ACG ID and ACG security token will be verified before connecting.
   */
  async connect(options?: ConnectionOptions): Promise<void | FetchError | Error> {
    let copied: void | Error, checkin: AcgCheckinResponse | FetchError

    if (this.socket?.connecting || this.socket?.writable) {
      return ClassLogger.warn('FcmClient', 'connect', 'The socket is already connected or is connecting.')
    }

    copied = await this.storage.copy(this.storageKey, this.data, ['received'])
    if (copied instanceof Error) return copied

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

  /**
   * Disconnects the socket.
   */
  async disconnect(error?: Error): Promise<void> {
    let promise: DeferredPromise<void> = new DeferredPromise()

    await this.storage.set(this.storageKey, this.data, ['received'])
    ClassLogger.verbose('FcmClient', 'disconnect', 'The received pids have been stored.')

    if (this.socket?.closed || this.socket?.destroyed) {
      return ClassLogger.warn('FcmClient', 'disconnect', 'The socket is already disconnected.')
    }

    this.socket?.on('close', () => {
      this.socket = undefined
      promise.resolve()
    })

    this.socket = this.socket?.destroy(error)

    return promise.instance
  }

  /**
   * Sends a login request message to the socket.
   */
  protected login(): void {
    let request: McsDefinitions.LoginRequest, encoded: Uint8Array, buffer: Buffer

    request = {
      account_id: parseLong(0n),
      adaptive_heartbeat: false,
      auth_service: McsDefinitions.LoginRequestAuthService.ANDROID_ID,
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

    buffer = Buffer.from([MCS_VERSION, McsTag.LOGIN_REQUEST, ...encoded])
    ClassLogger.verbose('FcmClient', 'onSocketReady', 'The login request buffer is ready.', buffer)

    this.data = DEFAULT_FCM_CLIENT_DATA()
    ClassLogger.verbose('FcmClient', 'onSocketReady', 'The data has been reset.', this.data)

    this.socket?.write(buffer)
    ClassLogger.info('FcmClient', 'onSocketReady', `The login request has been sent.`)
  }

  /**
   * Sends a heartbeat ping message to the socket.
   */
  protected heartbeat(): void {
    let ping: McsDefinitions.HeartbeatPing, encoded: Uint8Array, buffer: Buffer

    ping = {
      stream_id: this.data.heartbeat?.stream_id ?? this.data.login?.stream_id ?? 0,
      last_stream_id_received: this.data.heartbeat?.last_stream_id_received ?? this.data.login?.last_stream_id_received ?? 0,
      status: this.data.heartbeat?.status ?? parseLong(0n)
    }
    ClassLogger.verbose('FcmClient', 'onHeartbeat', 'The heartbeat ping has been created.', ping)

    encoded = MCSProto.HeartbeatPing.encodeDelimited(ping).finish()
    ClassLogger.verbose('FcmClient', 'onHeartbeat', 'The heartbeat ping has been encoded.', encoded)

    buffer = Buffer.from([McsTag.HEARTBEAT_PING, ...encoded])
    ClassLogger.verbose('FcmClient', 'onHeartbeat', 'The heartbeat ping buffer is ready', buffer)

    this.socket?.write(buffer)
    ClassLogger.info('FcmClient', 'onHeartbeat', 'HeartbeatPing', `The heartbeat ping has been sent.`)
  }

  /**
   * Prepares the data for the next message.
   */
  protected prepareForNextMessage(): void {
    this.data.cursor = 0
    this.data.size.packets = MCS_SIZE_PACKET_MIN_LENGTH
    this.data.state = McsState.TAG_AND_SIZE
    this.data.value = Buffer.alloc(0)
  }

  protected onSocketClose = (error: boolean): void => {
    if (error) {
      return ClassLogger.error('FcmClient', 'onSocketClose', 'The socket has been closed with errors.', [error])
    }

    ClassLogger.info('FcmClient', 'onSocketClose', 'The socket has been closed.')
  }

  protected onSocketConnect = (): void => {
    ClassLogger.info('FcmClient', 'onSocketConnect', 'The socket has been connected.')
  }

  /**
   * Handles the data received from the socket.
   *
   * - The data is always concatenated to the previous data.
   * - The data is handled based on the current state.
   *
   * States:
   *
   * - VERSION_TAG_AND_SIZE: Contains an extra byte at the beginning with the MCS version.
   * - TAG_AND_SIZE: Contains a tag which is always 1 byte and tells the type of the message, and a size which is variable in length and tells the size of the message.
   * - SIZE: Contains the size of the message.
   * - BYTES: Contains the message.
   */
  protected onSocketData = (data: Buffer): void => {
    this.data.value = Buffer.concat([this.data.value, data])
    ClassLogger.verbose('FcmClient', 'onSocketData', data, this.data.value, [data.length, this.data.value.length])

    switch (this.data.state) {
      case McsState.VERSION_TAG_AND_SIZE:
        if (this.data.value.length < MCS_VERSION_PACKET_LENGTH + MCS_TAG_PACKET_LENGTH + MCS_SIZE_PACKET_MIN_LENGTH) {
          return
        }

        this.onSocketDataVersion()
        this.onSocketDataTag()
        this.onSocketDataSize()

        break
      case McsState.TAG_AND_SIZE:
        if (this.data.value.length < MCS_TAG_PACKET_LENGTH + MCS_SIZE_PACKET_MIN_LENGTH) {
          return
        }

        this.onSocketDataTag()
        this.onSocketDataSize()

        break
      case McsState.SIZE:
        this.onSocketDataSize()
        break
      case McsState.BYTES:
        this.onSocketDataBytes()
        break
      default:
        ClassLogger.warn('FcmClient', 'onSocketData', `This state is not handled.`, [this.data.state])
        return
    }
  }

  /**
   * Reads the MCS version from first byte of the data.
   *
   * - Moves the cursor 1 byte forward.
   * - Sets the state to TAG_AND_SIZE.
   */
  protected onSocketDataVersion = (): void => {
    this.data.version = this.data.value.readUInt8(0)
    ClassLogger.info('FcmClient', 'onSocketDataVersion', this.data.version)

    if (this.data.version < MCS_VERSION) {
      this.socket?.destroy(new Error('Unsupported MCS version'))
      ClassLogger.error('FcmClient', 'onSocketDataVersion', 'Unsupported MCS version', this.data.version)

      return
    }

    this.data.cursor++
    ClassLogger.verbose('FcmClient', 'onSocketDataVersion', `Increasing the cursor by 1.`, [this.data.cursor])

    this.data.state = McsState.TAG_AND_SIZE
    ClassLogger.info('FcmClient', 'onSocketDataVersion', `Setting state to TAG_AND_SIZE.`, [this.data.state])
  }

  /**
   * Reads the tag from the first byte of the data, or the second byte if the version was read before.
   *
   * - Moves the cursor 1 byte forward.
   * - Sets the state to SIZE.
   */
  protected onSocketDataTag = (): void => {
    this.data.tag = this.data.value.readUInt8(this.data.cursor)
    ClassLogger.info('FcmClient', 'onSocketDataTag', [this.data.tag, McsTag[this.data.tag]])

    this.data.cursor++
    ClassLogger.verbose('FcmClient', 'onSocketDataTag', `Increasing the cursor by 1.`, [this.data.cursor])

    this.data.state = McsState.SIZE
    ClassLogger.info('FcmClient', 'onSocketDataTag', `Setting state to SIZE.`, [this.data.state])
  }

  /**
   * Reads the size from the data, the size can range from 1 to 5 bytes.
   *
   * - Aborts and waits for more bytes if there are not enough bytes to read.
   * - Aborts and prepares for the next message if the message was not decodable or decryptable with the maximum amount of bytes allowed for the size packet.
   * - Tries to decode the message with the current size and bytes, if it fails it increases the length of the size packet by 1 and tries again.
   * - Once the message is decodable and decryptable it moves the cursor by the size of the size packet and sets the state to BYTES.
   */
  protected onSocketDataSize = (): void => {
    let decodable: string | null | Error, decryptable: void | undefined | Error

    if (this.data.value.length - this.data.cursor < MCS_SIZE_PACKET_MIN_LENGTH) {
      ClassLogger.warn('FcmClient', 'onSocketDataSize', `Failed to read current message, not enough size packets.`)
      return
    }

    if (this.data.size.packets > MCS_SIZE_PACKET_MAX_LENGTH) {
      this.data.size.packets = MCS_SIZE_PACKET_MIN_LENGTH
      ClassLogger.warn('FcmClient', 'onSocketDataBytes', `Failed to read current message, resetting size packets and waiting for more bytes.`)

      setTimeout(this.onSocketDataSizeTimeout, MCS_SIZE_TIMEOUT)

      return
    }

    switch (this.data.tag) {
      case McsTag.CLOSE:
        decodable = tc(() => MCSProto.Close.verify(MCSProto.Close.decode(this.data.value.subarray(this.data.cursor + this.data.size.packets))), false)
        break
      case McsTag.DATA_MESSAGE_STANZA:
        decodable = tc(
          () => MCSProto.DataMessageStanza.verify(MCSProto.DataMessageStanza.decode(this.data.value.subarray(this.data.cursor + this.data.size.packets))),
          false
        )

        decryptable = tc(() => {
          let message: McsDefinitions.DataMessageStanza, decrypted: Buffer

          message = decodeProtoType(MCSProto.DataMessageStanza, this.data.value.subarray(this.data.cursor + this.data.size.packets))
          if (!message.raw_data) throw new Error(`The message raw_data is not defined.`)

          decrypted = decrypt(Buffer.from(message.raw_data), {
            authSecret: encodeBase64(this.ece.authSecret),
            dh: message.app_data.find((data: McsDefinitions.AppData) => data.key === 'crypto-key')?.value.slice(3),
            privateKey: createECDH(FCM_ECDH_CURVE_NAME).setPrivateKey(new Uint8Array(this.ece.privateKey)),
            salt: message.app_data.find((data: McsDefinitions.AppData) => data.key === 'encryption')?.value.slice(5),
            version: 'aesgcm'
          })

          JSON.parse(decodeText(decrypted))
        }, false)

        break
      case McsTag.HEARTBEAT_ACK:
        decodable = tc(
          () => MCSProto.HeartbeatAck.verify(MCSProto.HeartbeatAck.decode(this.data.value.subarray(this.data.cursor + this.data.size.packets))),
          false
        )
        break
      case McsTag.IQ_STANZA:
        decodable = tc(() => MCSProto.IqStanza.verify(MCSProto.IqStanza.decode(this.data.value.subarray(this.data.cursor + this.data.size.packets))), false)
        break
      case McsTag.LOGIN_RESPONSE:
        decodable = tc(
          () => MCSProto.LoginResponse.verify(MCSProto.LoginResponse.decode(this.data.value.subarray(this.data.cursor + this.data.size.packets))),
          false
        )
        break
      default:
        decodable = null
        break
    }

    if (decodable instanceof Error || typeof decodable === 'string' || decryptable instanceof Error) {
      ClassLogger.verbose('FcmClient', 'onSocketDataSize', `Failed to decode the message with current size and bytes.`, [
        this.data.size.packets,
        decodable,
        decryptable
      ])

      this.data.size.packets++
      ClassLogger.verbose('FcmClient', 'onSocketDataSize', `Increasing the packets by 1 and trying again.`, [this.data.size.packets])

      this.onSocketDataSize()

      return
    }

    clearTimeout(this.onSocketDataSizeTimeout)

    this.data.cursor += this.data.size.packets
    ClassLogger.verbose('FcmClient', 'onSocketDataSize', `Increasing the cursor by ${this.data.size.packets}.`, [this.data.cursor])

    this.data.state = McsState.BYTES
    ClassLogger.info('FcmClient', 'onSocketDataSize', `Setting state to BYTES.`, [this.data.state])

    this.onSocketDataBytes()
  }

  protected onSocketDataSizeTimeout = (): void => {
    this.prepareForNextMessage()
    ClassLogger.warn('FcmClient', 'onSocketDataSizeTimeout', 'The size state has timed out, ready for the next message.')
  }

  /**
   * Decodes the message based on the tag and prepares for the next message.
   *
   * Close:
   *
   * - Emits the `close` event.
   *
   * DataMessageStanza:
   *
   * - Emits the `message` event.
   * - Pushes the persistent ID of the message to the received persistent IDs and stores them.
   * - Decrypts the message data.
   * - Emits the `message-data` event with the decrypted data.
   *
   * HeartbeatAck:
   *
   * - Emits the `heartbeat` event.
   * - Schedules the next heartbeat.
   *
   * IqStanza:
   *
   * - Emits the `iq` event.
   *
   * LoginResponse:
   *
   * - Emits the `login` event.
   * - Resets the received persistent IDs and stores them.
   * - Calls the `heartbeat` function.
   */
  protected onSocketDataBytes = (): void => {
    switch (this.data.tag) {
      case McsTag.CLOSE: {
        let close: McsDefinitions.Close

        close = decodeProtoType(MCSProto.Close, this.data.value.subarray(this.data.cursor))
        ClassLogger.info('FcmClient', 'onSocketDataBytes', 'CLOSE', `The bytes have been decoded.`, close)

        this.emit('close')
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'CLOSE', `The close event has been emitted.`)

        break
      }
      case McsTag.DATA_MESSAGE_STANZA: {
        let message: McsDefinitions.DataMessageStanza, ecdh: ECDH, decrypted: Buffer, data: FcmClientMessageData

        message = decodeProtoType(MCSProto.DataMessageStanza, this.data.value.subarray(this.data.cursor))
        ClassLogger.info('FcmClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The bytes have been decoded.`, message)

        this.emit('message', message)
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The message event has been emitted.`)

        if (message.persistent_id) {
          this.data.received.pids.push(message.persistent_id)
          ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The persistent id has been pushed.`, this.data.received.pids)

          this.storage.set(this.storageKey, this.data, ['received'])
          ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The received pids have been stored.`)
        }

        ecdh = createECDH(FCM_ECDH_CURVE_NAME)
        ecdh.setPrivateKey(new Uint8Array(this.ece.privateKey))

        if (message.raw_data) {
          decrypted = decrypt(Buffer.from(message.raw_data), {
            authSecret: encodeBase64(this.ece.authSecret),
            dh: message.app_data.find((data: McsDefinitions.AppData) => data.key === 'crypto-key')?.value.slice(3),
            privateKey: ecdh,
            salt: message.app_data.find((data: McsDefinitions.AppData) => data.key === 'encryption')?.value.slice(5),
            version: 'aesgcm'
          })
          ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The message data has been decrypted.`, decrypted)

          data = JSON.parse(decodeText(decrypted))
          ClassLogger.info('FcmClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The message data has been parsed.`, data)

          this.emit('message-data', data)
          ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'DATA_MESSAGE_STANZA', `The message event has been emitted.`)
        }

        break
      }
      case McsTag.HEARTBEAT_ACK: {
        let heartbeat: McsDefinitions.HeartbeatAck

        heartbeat = decodeProtoType(MCSProto.HeartbeatAck, this.data.value.subarray(this.data.cursor))
        ClassLogger.info('FcmClient', 'onSocketDataBytes', 'HEARTBEAT_ACK', `The bytes have been decoded.`, heartbeat)

        this.emit('heartbeat', heartbeat)
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'HEARTBEAT_ACK', `The heartbeat event has been emitted.`)

        this.data.heartbeat = heartbeat
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'HEARTBEAT_ACK', `The heartbeat ack has been set inside data.`)

        setTimeout(this.heartbeat.bind(this), this.options.heartbeat?.frequency)

        break
      }
      case McsTag.IQ_STANZA: {
        let iq: McsDefinitions.IqStanza

        iq = decodeProtoType(MCSProto.IqStanza, this.data.value.subarray(this.data.cursor))
        ClassLogger.info('FcmClient', 'onSocketDataBytes', 'IQ_STANZA', `The bytes have been decoded.`, iq)

        this.emit('iq', iq)
        ClassLogger.verbose('FcmClient', 'onSocketDataBytes', 'IQ_STANZA', `The iq event has been emitted.`)

        break
      }
      case McsTag.LOGIN_RESPONSE: {
        let login: McsDefinitions.LoginResponse

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
      }
      default:
        ClassLogger.warn('FcmClient', 'onSocketDataBytes', `This tag is not handled.`, [this.data.tag, McsTag[this.data.tag]])
        break
    }

    this.prepareForNextMessage()
    ClassLogger.verbose('FcmClient', 'onSocketDataBytes', `Ready for the next message.`)
  }

  protected onSocketDrain = (): void => {
    ClassLogger.verbose('FcmClient', 'onSocketDrain', 'The socket has been drained.')
  }

  protected onSocketEnd = (): void => {
    ClassLogger.info('FcmClient', 'onSocketEnd', 'The socket connection has ended.')
  }

  protected onSocketError = (error: Error): void => {
    ClassLogger.error('FcmClient', 'onSocketError', error)
  }

  protected onSocketKeylog = (line: Buffer): void => {
    ClassLogger.verbose('FcmClient', 'onSocketKeylog', line)
  }

  protected onSocketLookup = (error: Error, address: string, family: string, host: string): void => {
    ClassLogger.verbose('FcmClient', 'onSocketLookup', [error, address, family, host])
  }

  protected onSocketOCSPResponse = (response: Buffer): void => {
    ClassLogger.verbose('FcmClient', 'onSocketOCSPResponse', response)
  }

  /**
   * Calls the `login` function when the socket is ready.
   */
  protected onSocketReady = (): void => {
    ClassLogger.info('FcmClient', 'onSocketReady', 'The socket is ready.')

    this.login()
    ClassLogger.verbose('FcmClient', 'onSocketReady', 'The login request has been sent.')
  }

  protected onSocketSecureConnect = (): void => {
    ClassLogger.verbose('FcmClient', 'onSocketSecureConnect', 'The socket has been securely connected.')
  }

  protected onSocketSession = (session: Buffer): void => {
    ClassLogger.verbose('FcmClient', 'onSocketSession', session)
  }

  protected onSocketTimeout = (): void => {
    ClassLogger.warn('FcmClient', 'onSocketTimeout', 'The socket has timed out.')
  }

  /**
   * Returns the ACG ID.
   */
  getAcgID(): bigint {
    return this.acg.id
  }

  /**
   * Returns the ACG security token.
   */
  getAcgSecurityToken(): bigint {
    return this.acg.securityToken
  }

  /**
   * Returns the auth secret.
   */
  getAuthSecret(): ArrayLike<number> {
    return this.ece.authSecret
  }

  /**
   * Returns the ECDH private key.
   */
  getEcdhPrivateKey(): ArrayLike<number> {
    return this.ece.privateKey
  }

  /**
   * Returns the heartbeat frequency.
   */
  getHeartbeatFrequency(): number {
    return this.options.heartbeat.frequency
  }

  /**
   * Returns the TLS socket.
   */
  getSocket(): TLSSocket | undefined {
    return this.socket
  }

  /**
   * Returns the storage.
   */
  getStorage(): Storage {
    return this.storage
  }

  /**
   * Returns the storage key.
   */
  getStorageKey(): string {
    return this.storageKey
  }

  /**
   * Sets the ACG ID.
   */
  setAcgID(id: bigint): this {
    this.acg.id = id
    return this
  }

  /**
   * Sets the ACG security token.
   */
  setAcgSecurityToken(securityToken: bigint): this {
    this.acg.securityToken = securityToken
    return this
  }

  /**
   * Sets the auth secret.
   */
  setAuthSecret(authSecret: ArrayLike<number>): this {
    this.ece.authSecret = authSecret
    return this
  }

  /**
   * Sets the ECDH private key.
   */
  setEcdhPrivateKey(privateKey: ArrayLike<number>): this {
    this.ece.privateKey = privateKey
    return this
  }

  /**
   * Sets the heartbeat frequency in ms.
   */
  setHeartbeatFrequency(ms: number): this {
    this.options.heartbeat.frequency = ms
    return this
  }
}
