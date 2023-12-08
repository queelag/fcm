/* eslint-disable */
import Long from 'long'
import _m0 from 'protobufjs/minimal.js'

export const protobufPackage = 'mcs_proto'

/** TAG: 0 */
export interface HeartbeatPing {
  streamId: number
  lastStreamIdReceived: number
  status: bigint
}

/** TAG: 1 */
export interface HeartbeatAck {
  streamId: number
  lastStreamIdReceived: number
  status: bigint
}

export interface ErrorInfo {
  code: number
  message: string
  type: string
  extension?: Extension | undefined
}

export interface Setting {
  name: string
  value: string
}

export interface HeartbeatStat {
  ip: string
  timeout: boolean
  intervalMs: number
}

export interface HeartbeatConfig {
  uploadStat: boolean
  ip: string
  intervalMs: number
}

/**
 * ClientEvents are used to inform the server of failed and successful
 * connections.
 */
export interface ClientEvent {
  /** Common fields [1-99] */
  type: ClientEvent_Type
  /** Fields for DISCARDED_EVENTS messages [100-199] */
  numberDiscardedEvents: number
  /**
   * Fields for FAILED_CONNECTION and SUCCESSFUL_CONNECTION messages [200-299]
   * Network type is a value in net::NetworkChangeNotifier::ConnectionType.
   */
  networkType: number
  timeConnectionStartedMs: bigint
  timeConnectionEndedMs: bigint
  /** Error code should be a net::Error value. */
  errorCode: number
  /** Fields for SUCCESSFUL_CONNECTION messages [300-399] */
  timeConnectionEstablishedMs: bigint
}

export enum ClientEvent_Type {
  UNKNOWN = 0,
  /** DISCARDED_EVENTS - Count of discarded events if the buffer filled up and was trimmed. */
  DISCARDED_EVENTS = 1,
  /**
   * FAILED_CONNECTION - Failed connection event: the connection failed to be established or we
   * had a login error.
   */
  FAILED_CONNECTION = 2,
  /**
   * SUCCESSFUL_CONNECTION - Successful connection event: information about the last successful
   * connection, including the time at which it was established.
   */
  SUCCESSFUL_CONNECTION = 3,
  UNRECOGNIZED = -1
}

export function clientEvent_TypeFromJSON(object: any): ClientEvent_Type {
  switch (object) {
    case 0:
    case 'UNKNOWN':
      return ClientEvent_Type.UNKNOWN
    case 1:
    case 'DISCARDED_EVENTS':
      return ClientEvent_Type.DISCARDED_EVENTS
    case 2:
    case 'FAILED_CONNECTION':
      return ClientEvent_Type.FAILED_CONNECTION
    case 3:
    case 'SUCCESSFUL_CONNECTION':
      return ClientEvent_Type.SUCCESSFUL_CONNECTION
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ClientEvent_Type.UNRECOGNIZED
  }
}

export function clientEvent_TypeToJSON(object: ClientEvent_Type): string {
  switch (object) {
    case ClientEvent_Type.UNKNOWN:
      return 'UNKNOWN'
    case ClientEvent_Type.DISCARDED_EVENTS:
      return 'DISCARDED_EVENTS'
    case ClientEvent_Type.FAILED_CONNECTION:
      return 'FAILED_CONNECTION'
    case ClientEvent_Type.SUCCESSFUL_CONNECTION:
      return 'SUCCESSFUL_CONNECTION'
    case ClientEvent_Type.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

/** TAG: 2 */
export interface LoginRequest {
  /** Must be present ( proto required ), may be empty */
  id: string
  /**
   * string.
   * mcs.android.com.
   */
  domain: string
  /** Decimal android ID */
  user: string
  resource: string
  /** Secret */
  authToken: string
  /**
   * Format is: android-HEX_DEVICE_ID
   * The user is the decimal value.
   */
  deviceId: string
  /** RMQ1 - no longer used */
  lastRmqId: bigint
  setting: Setting[]
  /** optional int32 compress = 9; */
  receivedPersistentId: string[]
  adaptiveHeartbeat: boolean
  heartbeatStat?: HeartbeatStat | undefined
  /** Must be true. */
  useRmq2: boolean
  accountId: bigint
  /** ANDROID_ID = 2 */
  authService: LoginRequest_AuthService
  networkType: number
  status: bigint
  /** Events recorded on the client after the last successful connection. */
  clientEvent: ClientEvent[]
}

export enum LoginRequest_AuthService {
  ANDROID_ID = 2,
  UNRECOGNIZED = -1
}

export function loginRequest_AuthServiceFromJSON(object: any): LoginRequest_AuthService {
  switch (object) {
    case 2:
    case 'ANDROID_ID':
      return LoginRequest_AuthService.ANDROID_ID
    case -1:
    case 'UNRECOGNIZED':
    default:
      return LoginRequest_AuthService.UNRECOGNIZED
  }
}

export function loginRequest_AuthServiceToJSON(object: LoginRequest_AuthService): string {
  switch (object) {
    case LoginRequest_AuthService.ANDROID_ID:
      return 'ANDROID_ID'
    case LoginRequest_AuthService.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

/** TAG: 3 */
export interface LoginResponse {
  id: string
  /** Not used. */
  jid: string
  /** Null if login was ok. */
  error?: ErrorInfo | undefined
  setting: Setting[]
  streamId: number
  /** Should be "1" */
  lastStreamIdReceived: number
  heartbeatConfig?: HeartbeatConfig | undefined
  /** used by the client to synchronize with the server timestamp. */
  serverTimestamp: bigint
}

export interface StreamErrorStanza {
  type: string
  text: string
}

/** TAG: 4 */
export interface Close {}

export interface Extension {
  /**
   * 12: SelectiveAck
   * 13: StreamAck
   */
  id: number
  data: Uint8Array
}

/**
 * TAG: 7
 * IqRequest must contain a single extension.  IqResponse may contain 0 or 1
 * extensions.
 */
export interface IqStanza {
  rmqId: bigint
  type: IqStanza_IqType
  id: string
  from: string
  to: string
  error?: ErrorInfo | undefined
  /** Only field used in the 38+ protocol (besides common last_stream_id_received, status, rmq_id) */
  extension?: Extension | undefined
  persistentId: string
  streamId: number
  lastStreamIdReceived: number
  accountId: bigint
  status: bigint
}

export enum IqStanza_IqType {
  GET = 0,
  SET = 1,
  RESULT = 2,
  IQ_ERROR = 3,
  UNRECOGNIZED = -1
}

export function iqStanza_IqTypeFromJSON(object: any): IqStanza_IqType {
  switch (object) {
    case 0:
    case 'GET':
      return IqStanza_IqType.GET
    case 1:
    case 'SET':
      return IqStanza_IqType.SET
    case 2:
    case 'RESULT':
      return IqStanza_IqType.RESULT
    case 3:
    case 'IQ_ERROR':
      return IqStanza_IqType.IQ_ERROR
    case -1:
    case 'UNRECOGNIZED':
    default:
      return IqStanza_IqType.UNRECOGNIZED
  }
}

export function iqStanza_IqTypeToJSON(object: IqStanza_IqType): string {
  switch (object) {
    case IqStanza_IqType.GET:
      return 'GET'
    case IqStanza_IqType.SET:
      return 'SET'
    case IqStanza_IqType.RESULT:
      return 'RESULT'
    case IqStanza_IqType.IQ_ERROR:
      return 'IQ_ERROR'
    case IqStanza_IqType.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED'
  }
}

export interface AppData {
  key: string
  value: string
}

/** TAG: 8 */
export interface DataMessageStanza {
  /** This is the message ID, set by client, DMP.9 (message_id) */
  id: string
  /** Project ID of the sender, DMP.1 */
  from: string
  /** Part of DMRequest - also the key in DataMessageProto. */
  to: string
  /** Package name. DMP.2 */
  category: string
  /** The collapsed key, DMP.3 */
  token: string
  /** User data + GOOGLE. prefixed special entries, DMP.4 */
  appData: AppData[]
  /** Not used. */
  fromTrustedServer: boolean
  /**
   * Part of the ACK protocol, returned in DataMessageResponse on server side.
   * It's part of the key of DMP.
   */
  persistentId: string
  /**
   * In-stream ack. Increments on each message sent - a bit redundant
   * Not used in DMP/DMR.
   */
  streamId: number
  lastStreamIdReceived: number
  /** Sent by the device shortly after registration. */
  regId: string
  /**
   * serial number of the target user, DMP.8
   * It is the 'serial number' according to user manager.
   */
  deviceUserId: bigint
  /** Time to live, in seconds. */
  ttl: number
  /** Timestamp ( according to client ) when message was sent by app, in seconds */
  sent: bigint
  /**
   * How long has the message been queued before the flush, in seconds.
   * This is needed to account for the time difference between server and
   * client: server should adjust 'sent' based on its 'receive' time.
   */
  queued: number
  status: bigint
  /** Optional field containing the binary payload of the message. */
  rawData: Uint8Array
  /**
   * If set the server requests immediate ack. Used for important messages and
   * for testing.
   */
  immediateAck: boolean
}

/**
 * Included in IQ with ID 13, sent from client or server after 10 unconfirmed
 * messages.
 */
export interface StreamAck {}

/** Included in IQ sent after LoginResponse from server with ID 12. */
export interface SelectiveAck {
  id: string[]
}

function createBaseHeartbeatPing(): HeartbeatPing {
  return { streamId: 0, lastStreamIdReceived: 0, status: BigInt('0') }
}

export const HeartbeatPing = {
  encode(message: HeartbeatPing, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.streamId !== 0) {
      writer.uint32(8).int32(message.streamId)
    }
    if (message.lastStreamIdReceived !== 0) {
      writer.uint32(16).int32(message.lastStreamIdReceived)
    }
    if (message.status !== BigInt('0')) {
      if (BigInt.asIntN(64, message.status) !== message.status) {
        throw new Error('value provided for field message.status of type int64 too large')
      }
      writer.uint32(24).int64(message.status.toString())
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HeartbeatPing {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseHeartbeatPing()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }

          message.streamId = reader.int32()
          continue
        case 2:
          if (tag !== 16) {
            break
          }

          message.lastStreamIdReceived = reader.int32()
          continue
        case 3:
          if (tag !== 24) {
            break
          }

          message.status = longToBigint(reader.int64() as Long)
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): HeartbeatPing {
    return {
      streamId: isSet(object.streamId) ? globalThis.Number(object.streamId) : 0,
      lastStreamIdReceived: isSet(object.lastStreamIdReceived) ? globalThis.Number(object.lastStreamIdReceived) : 0,
      status: isSet(object.status) ? BigInt(object.status) : BigInt('0')
    }
  },

  toJSON(message: HeartbeatPing): unknown {
    const obj: any = {}
    if (message.streamId !== 0) {
      obj.streamId = Math.round(message.streamId)
    }
    if (message.lastStreamIdReceived !== 0) {
      obj.lastStreamIdReceived = Math.round(message.lastStreamIdReceived)
    }
    if (message.status !== BigInt('0')) {
      obj.status = message.status.toString()
    }
    return obj
  },

  create<I extends Exact<DeepPartial<HeartbeatPing>, I>>(base?: I): HeartbeatPing {
    return HeartbeatPing.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<HeartbeatPing>, I>>(object: I): HeartbeatPing {
    const message = createBaseHeartbeatPing()
    message.streamId = object.streamId ?? 0
    message.lastStreamIdReceived = object.lastStreamIdReceived ?? 0
    message.status = object.status ?? BigInt('0')
    return message
  }
}

function createBaseHeartbeatAck(): HeartbeatAck {
  return { streamId: 0, lastStreamIdReceived: 0, status: BigInt('0') }
}

export const HeartbeatAck = {
  encode(message: HeartbeatAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.streamId !== 0) {
      writer.uint32(8).int32(message.streamId)
    }
    if (message.lastStreamIdReceived !== 0) {
      writer.uint32(16).int32(message.lastStreamIdReceived)
    }
    if (message.status !== BigInt('0')) {
      if (BigInt.asIntN(64, message.status) !== message.status) {
        throw new Error('value provided for field message.status of type int64 too large')
      }
      writer.uint32(24).int64(message.status.toString())
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HeartbeatAck {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseHeartbeatAck()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }

          message.streamId = reader.int32()
          continue
        case 2:
          if (tag !== 16) {
            break
          }

          message.lastStreamIdReceived = reader.int32()
          continue
        case 3:
          if (tag !== 24) {
            break
          }

          message.status = longToBigint(reader.int64() as Long)
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): HeartbeatAck {
    return {
      streamId: isSet(object.streamId) ? globalThis.Number(object.streamId) : 0,
      lastStreamIdReceived: isSet(object.lastStreamIdReceived) ? globalThis.Number(object.lastStreamIdReceived) : 0,
      status: isSet(object.status) ? BigInt(object.status) : BigInt('0')
    }
  },

  toJSON(message: HeartbeatAck): unknown {
    const obj: any = {}
    if (message.streamId !== 0) {
      obj.streamId = Math.round(message.streamId)
    }
    if (message.lastStreamIdReceived !== 0) {
      obj.lastStreamIdReceived = Math.round(message.lastStreamIdReceived)
    }
    if (message.status !== BigInt('0')) {
      obj.status = message.status.toString()
    }
    return obj
  },

  create<I extends Exact<DeepPartial<HeartbeatAck>, I>>(base?: I): HeartbeatAck {
    return HeartbeatAck.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<HeartbeatAck>, I>>(object: I): HeartbeatAck {
    const message = createBaseHeartbeatAck()
    message.streamId = object.streamId ?? 0
    message.lastStreamIdReceived = object.lastStreamIdReceived ?? 0
    message.status = object.status ?? BigInt('0')
    return message
  }
}

function createBaseErrorInfo(): ErrorInfo {
  return { code: 0, message: '', type: '', extension: undefined }
}

export const ErrorInfo = {
  encode(message: ErrorInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code)
    }
    if (message.message !== '') {
      writer.uint32(18).string(message.message)
    }
    if (message.type !== '') {
      writer.uint32(26).string(message.type)
    }
    if (message.extension !== undefined) {
      Extension.encode(message.extension, writer.uint32(34).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ErrorInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseErrorInfo()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }

          message.code = reader.int32()
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.message = reader.string()
          continue
        case 3:
          if (tag !== 26) {
            break
          }

          message.type = reader.string()
          continue
        case 4:
          if (tag !== 34) {
            break
          }

          message.extension = Extension.decode(reader, reader.uint32())
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): ErrorInfo {
    return {
      code: isSet(object.code) ? globalThis.Number(object.code) : 0,
      message: isSet(object.message) ? globalThis.String(object.message) : '',
      type: isSet(object.type) ? globalThis.String(object.type) : '',
      extension: isSet(object.extension) ? Extension.fromJSON(object.extension) : undefined
    }
  },

  toJSON(message: ErrorInfo): unknown {
    const obj: any = {}
    if (message.code !== 0) {
      obj.code = Math.round(message.code)
    }
    if (message.message !== '') {
      obj.message = message.message
    }
    if (message.type !== '') {
      obj.type = message.type
    }
    if (message.extension !== undefined) {
      obj.extension = Extension.toJSON(message.extension)
    }
    return obj
  },

  create<I extends Exact<DeepPartial<ErrorInfo>, I>>(base?: I): ErrorInfo {
    return ErrorInfo.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<ErrorInfo>, I>>(object: I): ErrorInfo {
    const message = createBaseErrorInfo()
    message.code = object.code ?? 0
    message.message = object.message ?? ''
    message.type = object.type ?? ''
    message.extension = object.extension !== undefined && object.extension !== null ? Extension.fromPartial(object.extension) : undefined
    return message
  }
}

function createBaseSetting(): Setting {
  return { name: '', value: '' }
}

export const Setting = {
  encode(message: Setting, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name)
    }
    if (message.value !== '') {
      writer.uint32(18).string(message.value)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Setting {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseSetting()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.name = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.value = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): Setting {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : '',
      value: isSet(object.value) ? globalThis.String(object.value) : ''
    }
  },

  toJSON(message: Setting): unknown {
    const obj: any = {}
    if (message.name !== '') {
      obj.name = message.name
    }
    if (message.value !== '') {
      obj.value = message.value
    }
    return obj
  },

  create<I extends Exact<DeepPartial<Setting>, I>>(base?: I): Setting {
    return Setting.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<Setting>, I>>(object: I): Setting {
    const message = createBaseSetting()
    message.name = object.name ?? ''
    message.value = object.value ?? ''
    return message
  }
}

function createBaseHeartbeatStat(): HeartbeatStat {
  return { ip: '', timeout: false, intervalMs: 0 }
}

export const HeartbeatStat = {
  encode(message: HeartbeatStat, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ip !== '') {
      writer.uint32(10).string(message.ip)
    }
    if (message.timeout === true) {
      writer.uint32(16).bool(message.timeout)
    }
    if (message.intervalMs !== 0) {
      writer.uint32(24).int32(message.intervalMs)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HeartbeatStat {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseHeartbeatStat()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.ip = reader.string()
          continue
        case 2:
          if (tag !== 16) {
            break
          }

          message.timeout = reader.bool()
          continue
        case 3:
          if (tag !== 24) {
            break
          }

          message.intervalMs = reader.int32()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): HeartbeatStat {
    return {
      ip: isSet(object.ip) ? globalThis.String(object.ip) : '',
      timeout: isSet(object.timeout) ? globalThis.Boolean(object.timeout) : false,
      intervalMs: isSet(object.intervalMs) ? globalThis.Number(object.intervalMs) : 0
    }
  },

  toJSON(message: HeartbeatStat): unknown {
    const obj: any = {}
    if (message.ip !== '') {
      obj.ip = message.ip
    }
    if (message.timeout === true) {
      obj.timeout = message.timeout
    }
    if (message.intervalMs !== 0) {
      obj.intervalMs = Math.round(message.intervalMs)
    }
    return obj
  },

  create<I extends Exact<DeepPartial<HeartbeatStat>, I>>(base?: I): HeartbeatStat {
    return HeartbeatStat.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<HeartbeatStat>, I>>(object: I): HeartbeatStat {
    const message = createBaseHeartbeatStat()
    message.ip = object.ip ?? ''
    message.timeout = object.timeout ?? false
    message.intervalMs = object.intervalMs ?? 0
    return message
  }
}

function createBaseHeartbeatConfig(): HeartbeatConfig {
  return { uploadStat: false, ip: '', intervalMs: 0 }
}

export const HeartbeatConfig = {
  encode(message: HeartbeatConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.uploadStat === true) {
      writer.uint32(8).bool(message.uploadStat)
    }
    if (message.ip !== '') {
      writer.uint32(18).string(message.ip)
    }
    if (message.intervalMs !== 0) {
      writer.uint32(24).int32(message.intervalMs)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HeartbeatConfig {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseHeartbeatConfig()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }

          message.uploadStat = reader.bool()
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.ip = reader.string()
          continue
        case 3:
          if (tag !== 24) {
            break
          }

          message.intervalMs = reader.int32()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): HeartbeatConfig {
    return {
      uploadStat: isSet(object.uploadStat) ? globalThis.Boolean(object.uploadStat) : false,
      ip: isSet(object.ip) ? globalThis.String(object.ip) : '',
      intervalMs: isSet(object.intervalMs) ? globalThis.Number(object.intervalMs) : 0
    }
  },

  toJSON(message: HeartbeatConfig): unknown {
    const obj: any = {}
    if (message.uploadStat === true) {
      obj.uploadStat = message.uploadStat
    }
    if (message.ip !== '') {
      obj.ip = message.ip
    }
    if (message.intervalMs !== 0) {
      obj.intervalMs = Math.round(message.intervalMs)
    }
    return obj
  },

  create<I extends Exact<DeepPartial<HeartbeatConfig>, I>>(base?: I): HeartbeatConfig {
    return HeartbeatConfig.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<HeartbeatConfig>, I>>(object: I): HeartbeatConfig {
    const message = createBaseHeartbeatConfig()
    message.uploadStat = object.uploadStat ?? false
    message.ip = object.ip ?? ''
    message.intervalMs = object.intervalMs ?? 0
    return message
  }
}

function createBaseClientEvent(): ClientEvent {
  return {
    type: 0,
    numberDiscardedEvents: 0,
    networkType: 0,
    timeConnectionStartedMs: BigInt('0'),
    timeConnectionEndedMs: BigInt('0'),
    errorCode: 0,
    timeConnectionEstablishedMs: BigInt('0')
  }
}

export const ClientEvent = {
  encode(message: ClientEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type)
    }
    if (message.numberDiscardedEvents !== 0) {
      writer.uint32(800).uint32(message.numberDiscardedEvents)
    }
    if (message.networkType !== 0) {
      writer.uint32(1600).int32(message.networkType)
    }
    if (message.timeConnectionStartedMs !== BigInt('0')) {
      if (BigInt.asUintN(64, message.timeConnectionStartedMs) !== message.timeConnectionStartedMs) {
        throw new Error('value provided for field message.timeConnectionStartedMs of type uint64 too large')
      }
      writer.uint32(1616).uint64(message.timeConnectionStartedMs.toString())
    }
    if (message.timeConnectionEndedMs !== BigInt('0')) {
      if (BigInt.asUintN(64, message.timeConnectionEndedMs) !== message.timeConnectionEndedMs) {
        throw new Error('value provided for field message.timeConnectionEndedMs of type uint64 too large')
      }
      writer.uint32(1624).uint64(message.timeConnectionEndedMs.toString())
    }
    if (message.errorCode !== 0) {
      writer.uint32(1632).int32(message.errorCode)
    }
    if (message.timeConnectionEstablishedMs !== BigInt('0')) {
      if (BigInt.asUintN(64, message.timeConnectionEstablishedMs) !== message.timeConnectionEstablishedMs) {
        throw new Error('value provided for field message.timeConnectionEstablishedMs of type uint64 too large')
      }
      writer.uint32(2400).uint64(message.timeConnectionEstablishedMs.toString())
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ClientEvent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseClientEvent()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }

          message.type = reader.int32() as any
          continue
        case 100:
          if (tag !== 800) {
            break
          }

          message.numberDiscardedEvents = reader.uint32()
          continue
        case 200:
          if (tag !== 1600) {
            break
          }

          message.networkType = reader.int32()
          continue
        case 202:
          if (tag !== 1616) {
            break
          }

          message.timeConnectionStartedMs = longToBigint(reader.uint64() as Long)
          continue
        case 203:
          if (tag !== 1624) {
            break
          }

          message.timeConnectionEndedMs = longToBigint(reader.uint64() as Long)
          continue
        case 204:
          if (tag !== 1632) {
            break
          }

          message.errorCode = reader.int32()
          continue
        case 300:
          if (tag !== 2400) {
            break
          }

          message.timeConnectionEstablishedMs = longToBigint(reader.uint64() as Long)
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): ClientEvent {
    return {
      type: isSet(object.type) ? clientEvent_TypeFromJSON(object.type) : 0,
      numberDiscardedEvents: isSet(object.numberDiscardedEvents) ? globalThis.Number(object.numberDiscardedEvents) : 0,
      networkType: isSet(object.networkType) ? globalThis.Number(object.networkType) : 0,
      timeConnectionStartedMs: isSet(object.timeConnectionStartedMs) ? BigInt(object.timeConnectionStartedMs) : BigInt('0'),
      timeConnectionEndedMs: isSet(object.timeConnectionEndedMs) ? BigInt(object.timeConnectionEndedMs) : BigInt('0'),
      errorCode: isSet(object.errorCode) ? globalThis.Number(object.errorCode) : 0,
      timeConnectionEstablishedMs: isSet(object.timeConnectionEstablishedMs) ? BigInt(object.timeConnectionEstablishedMs) : BigInt('0')
    }
  },

  toJSON(message: ClientEvent): unknown {
    const obj: any = {}
    if (message.type !== 0) {
      obj.type = clientEvent_TypeToJSON(message.type)
    }
    if (message.numberDiscardedEvents !== 0) {
      obj.numberDiscardedEvents = Math.round(message.numberDiscardedEvents)
    }
    if (message.networkType !== 0) {
      obj.networkType = Math.round(message.networkType)
    }
    if (message.timeConnectionStartedMs !== BigInt('0')) {
      obj.timeConnectionStartedMs = message.timeConnectionStartedMs.toString()
    }
    if (message.timeConnectionEndedMs !== BigInt('0')) {
      obj.timeConnectionEndedMs = message.timeConnectionEndedMs.toString()
    }
    if (message.errorCode !== 0) {
      obj.errorCode = Math.round(message.errorCode)
    }
    if (message.timeConnectionEstablishedMs !== BigInt('0')) {
      obj.timeConnectionEstablishedMs = message.timeConnectionEstablishedMs.toString()
    }
    return obj
  },

  create<I extends Exact<DeepPartial<ClientEvent>, I>>(base?: I): ClientEvent {
    return ClientEvent.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<ClientEvent>, I>>(object: I): ClientEvent {
    const message = createBaseClientEvent()
    message.type = object.type ?? 0
    message.numberDiscardedEvents = object.numberDiscardedEvents ?? 0
    message.networkType = object.networkType ?? 0
    message.timeConnectionStartedMs = object.timeConnectionStartedMs ?? BigInt('0')
    message.timeConnectionEndedMs = object.timeConnectionEndedMs ?? BigInt('0')
    message.errorCode = object.errorCode ?? 0
    message.timeConnectionEstablishedMs = object.timeConnectionEstablishedMs ?? BigInt('0')
    return message
  }
}

function createBaseLoginRequest(): LoginRequest {
  return {
    id: '',
    domain: '',
    user: '',
    resource: '',
    authToken: '',
    deviceId: '',
    lastRmqId: BigInt('0'),
    setting: [],
    receivedPersistentId: [],
    adaptiveHeartbeat: false,
    heartbeatStat: undefined,
    useRmq2: false,
    accountId: BigInt('0'),
    authService: 2,
    networkType: 0,
    status: BigInt('0'),
    clientEvent: []
  }
}

export const LoginRequest = {
  encode(message: LoginRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
    }
    if (message.domain !== '') {
      writer.uint32(18).string(message.domain)
    }
    if (message.user !== '') {
      writer.uint32(26).string(message.user)
    }
    if (message.resource !== '') {
      writer.uint32(34).string(message.resource)
    }
    if (message.authToken !== '') {
      writer.uint32(42).string(message.authToken)
    }
    if (message.deviceId !== '') {
      writer.uint32(50).string(message.deviceId)
    }
    if (message.lastRmqId !== BigInt('0')) {
      if (BigInt.asIntN(64, message.lastRmqId) !== message.lastRmqId) {
        throw new Error('value provided for field message.lastRmqId of type int64 too large')
      }
      writer.uint32(56).int64(message.lastRmqId.toString())
    }
    for (const v of message.setting) {
      Setting.encode(v!, writer.uint32(66).fork()).ldelim()
    }
    for (const v of message.receivedPersistentId) {
      writer.uint32(82).string(v!)
    }
    if (message.adaptiveHeartbeat === true) {
      writer.uint32(96).bool(message.adaptiveHeartbeat)
    }
    if (message.heartbeatStat !== undefined) {
      HeartbeatStat.encode(message.heartbeatStat, writer.uint32(106).fork()).ldelim()
    }
    if (message.useRmq2 === true) {
      writer.uint32(112).bool(message.useRmq2)
    }
    if (message.accountId !== BigInt('0')) {
      if (BigInt.asIntN(64, message.accountId) !== message.accountId) {
        throw new Error('value provided for field message.accountId of type int64 too large')
      }
      writer.uint32(120).int64(message.accountId.toString())
    }
    if (message.authService !== 2) {
      writer.uint32(128).int32(message.authService)
    }
    if (message.networkType !== 0) {
      writer.uint32(136).int32(message.networkType)
    }
    if (message.status !== BigInt('0')) {
      if (BigInt.asIntN(64, message.status) !== message.status) {
        throw new Error('value provided for field message.status of type int64 too large')
      }
      writer.uint32(144).int64(message.status.toString())
    }
    for (const v of message.clientEvent) {
      ClientEvent.encode(v!, writer.uint32(178).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoginRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseLoginRequest()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.id = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.domain = reader.string()
          continue
        case 3:
          if (tag !== 26) {
            break
          }

          message.user = reader.string()
          continue
        case 4:
          if (tag !== 34) {
            break
          }

          message.resource = reader.string()
          continue
        case 5:
          if (tag !== 42) {
            break
          }

          message.authToken = reader.string()
          continue
        case 6:
          if (tag !== 50) {
            break
          }

          message.deviceId = reader.string()
          continue
        case 7:
          if (tag !== 56) {
            break
          }

          message.lastRmqId = longToBigint(reader.int64() as Long)
          continue
        case 8:
          if (tag !== 66) {
            break
          }

          message.setting.push(Setting.decode(reader, reader.uint32()))
          continue
        case 10:
          if (tag !== 82) {
            break
          }

          message.receivedPersistentId.push(reader.string())
          continue
        case 12:
          if (tag !== 96) {
            break
          }

          message.adaptiveHeartbeat = reader.bool()
          continue
        case 13:
          if (tag !== 106) {
            break
          }

          message.heartbeatStat = HeartbeatStat.decode(reader, reader.uint32())
          continue
        case 14:
          if (tag !== 112) {
            break
          }

          message.useRmq2 = reader.bool()
          continue
        case 15:
          if (tag !== 120) {
            break
          }

          message.accountId = longToBigint(reader.int64() as Long)
          continue
        case 16:
          if (tag !== 128) {
            break
          }

          message.authService = reader.int32() as any
          continue
        case 17:
          if (tag !== 136) {
            break
          }

          message.networkType = reader.int32()
          continue
        case 18:
          if (tag !== 144) {
            break
          }

          message.status = longToBigint(reader.int64() as Long)
          continue
        case 22:
          if (tag !== 178) {
            break
          }

          message.clientEvent.push(ClientEvent.decode(reader, reader.uint32()))
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): LoginRequest {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : '',
      domain: isSet(object.domain) ? globalThis.String(object.domain) : '',
      user: isSet(object.user) ? globalThis.String(object.user) : '',
      resource: isSet(object.resource) ? globalThis.String(object.resource) : '',
      authToken: isSet(object.authToken) ? globalThis.String(object.authToken) : '',
      deviceId: isSet(object.deviceId) ? globalThis.String(object.deviceId) : '',
      lastRmqId: isSet(object.lastRmqId) ? BigInt(object.lastRmqId) : BigInt('0'),
      setting: globalThis.Array.isArray(object?.setting) ? object.setting.map((e: any) => Setting.fromJSON(e)) : [],
      receivedPersistentId: globalThis.Array.isArray(object?.receivedPersistentId) ? object.receivedPersistentId.map((e: any) => globalThis.String(e)) : [],
      adaptiveHeartbeat: isSet(object.adaptiveHeartbeat) ? globalThis.Boolean(object.adaptiveHeartbeat) : false,
      heartbeatStat: isSet(object.heartbeatStat) ? HeartbeatStat.fromJSON(object.heartbeatStat) : undefined,
      useRmq2: isSet(object.useRmq2) ? globalThis.Boolean(object.useRmq2) : false,
      accountId: isSet(object.accountId) ? BigInt(object.accountId) : BigInt('0'),
      authService: isSet(object.authService) ? loginRequest_AuthServiceFromJSON(object.authService) : 2,
      networkType: isSet(object.networkType) ? globalThis.Number(object.networkType) : 0,
      status: isSet(object.status) ? BigInt(object.status) : BigInt('0'),
      clientEvent: globalThis.Array.isArray(object?.clientEvent) ? object.clientEvent.map((e: any) => ClientEvent.fromJSON(e)) : []
    }
  },

  toJSON(message: LoginRequest): unknown {
    const obj: any = {}
    if (message.id !== '') {
      obj.id = message.id
    }
    if (message.domain !== '') {
      obj.domain = message.domain
    }
    if (message.user !== '') {
      obj.user = message.user
    }
    if (message.resource !== '') {
      obj.resource = message.resource
    }
    if (message.authToken !== '') {
      obj.authToken = message.authToken
    }
    if (message.deviceId !== '') {
      obj.deviceId = message.deviceId
    }
    if (message.lastRmqId !== BigInt('0')) {
      obj.lastRmqId = message.lastRmqId.toString()
    }
    if (message.setting?.length) {
      obj.setting = message.setting.map((e) => Setting.toJSON(e))
    }
    if (message.receivedPersistentId?.length) {
      obj.receivedPersistentId = message.receivedPersistentId
    }
    if (message.adaptiveHeartbeat === true) {
      obj.adaptiveHeartbeat = message.adaptiveHeartbeat
    }
    if (message.heartbeatStat !== undefined) {
      obj.heartbeatStat = HeartbeatStat.toJSON(message.heartbeatStat)
    }
    if (message.useRmq2 === true) {
      obj.useRmq2 = message.useRmq2
    }
    if (message.accountId !== BigInt('0')) {
      obj.accountId = message.accountId.toString()
    }
    if (message.authService !== 2) {
      obj.authService = loginRequest_AuthServiceToJSON(message.authService)
    }
    if (message.networkType !== 0) {
      obj.networkType = Math.round(message.networkType)
    }
    if (message.status !== BigInt('0')) {
      obj.status = message.status.toString()
    }
    if (message.clientEvent?.length) {
      obj.clientEvent = message.clientEvent.map((e) => ClientEvent.toJSON(e))
    }
    return obj
  },

  create<I extends Exact<DeepPartial<LoginRequest>, I>>(base?: I): LoginRequest {
    return LoginRequest.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<LoginRequest>, I>>(object: I): LoginRequest {
    const message = createBaseLoginRequest()
    message.id = object.id ?? ''
    message.domain = object.domain ?? ''
    message.user = object.user ?? ''
    message.resource = object.resource ?? ''
    message.authToken = object.authToken ?? ''
    message.deviceId = object.deviceId ?? ''
    message.lastRmqId = object.lastRmqId ?? BigInt('0')
    message.setting = object.setting?.map((e) => Setting.fromPartial(e)) || []
    message.receivedPersistentId = object.receivedPersistentId?.map((e) => e) || []
    message.adaptiveHeartbeat = object.adaptiveHeartbeat ?? false
    message.heartbeatStat = object.heartbeatStat !== undefined && object.heartbeatStat !== null ? HeartbeatStat.fromPartial(object.heartbeatStat) : undefined
    message.useRmq2 = object.useRmq2 ?? false
    message.accountId = object.accountId ?? BigInt('0')
    message.authService = object.authService ?? 2
    message.networkType = object.networkType ?? 0
    message.status = object.status ?? BigInt('0')
    message.clientEvent = object.clientEvent?.map((e) => ClientEvent.fromPartial(e)) || []
    return message
  }
}

function createBaseLoginResponse(): LoginResponse {
  return {
    id: '',
    jid: '',
    error: undefined,
    setting: [],
    streamId: 0,
    lastStreamIdReceived: 0,
    heartbeatConfig: undefined,
    serverTimestamp: BigInt('0')
  }
}

export const LoginResponse = {
  encode(message: LoginResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
    }
    if (message.jid !== '') {
      writer.uint32(18).string(message.jid)
    }
    if (message.error !== undefined) {
      ErrorInfo.encode(message.error, writer.uint32(26).fork()).ldelim()
    }
    for (const v of message.setting) {
      Setting.encode(v!, writer.uint32(34).fork()).ldelim()
    }
    if (message.streamId !== 0) {
      writer.uint32(40).int32(message.streamId)
    }
    if (message.lastStreamIdReceived !== 0) {
      writer.uint32(48).int32(message.lastStreamIdReceived)
    }
    if (message.heartbeatConfig !== undefined) {
      HeartbeatConfig.encode(message.heartbeatConfig, writer.uint32(58).fork()).ldelim()
    }
    if (message.serverTimestamp !== BigInt('0')) {
      if (BigInt.asIntN(64, message.serverTimestamp) !== message.serverTimestamp) {
        throw new Error('value provided for field message.serverTimestamp of type int64 too large')
      }
      writer.uint32(64).int64(message.serverTimestamp.toString())
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LoginResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseLoginResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.id = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.jid = reader.string()
          continue
        case 3:
          if (tag !== 26) {
            break
          }

          message.error = ErrorInfo.decode(reader, reader.uint32())
          continue
        case 4:
          if (tag !== 34) {
            break
          }

          message.setting.push(Setting.decode(reader, reader.uint32()))
          continue
        case 5:
          if (tag !== 40) {
            break
          }

          message.streamId = reader.int32()
          continue
        case 6:
          if (tag !== 48) {
            break
          }

          message.lastStreamIdReceived = reader.int32()
          continue
        case 7:
          if (tag !== 58) {
            break
          }

          message.heartbeatConfig = HeartbeatConfig.decode(reader, reader.uint32())
          continue
        case 8:
          if (tag !== 64) {
            break
          }

          message.serverTimestamp = longToBigint(reader.int64() as Long)
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): LoginResponse {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : '',
      jid: isSet(object.jid) ? globalThis.String(object.jid) : '',
      error: isSet(object.error) ? ErrorInfo.fromJSON(object.error) : undefined,
      setting: globalThis.Array.isArray(object?.setting) ? object.setting.map((e: any) => Setting.fromJSON(e)) : [],
      streamId: isSet(object.streamId) ? globalThis.Number(object.streamId) : 0,
      lastStreamIdReceived: isSet(object.lastStreamIdReceived) ? globalThis.Number(object.lastStreamIdReceived) : 0,
      heartbeatConfig: isSet(object.heartbeatConfig) ? HeartbeatConfig.fromJSON(object.heartbeatConfig) : undefined,
      serverTimestamp: isSet(object.serverTimestamp) ? BigInt(object.serverTimestamp) : BigInt('0')
    }
  },

  toJSON(message: LoginResponse): unknown {
    const obj: any = {}
    if (message.id !== '') {
      obj.id = message.id
    }
    if (message.jid !== '') {
      obj.jid = message.jid
    }
    if (message.error !== undefined) {
      obj.error = ErrorInfo.toJSON(message.error)
    }
    if (message.setting?.length) {
      obj.setting = message.setting.map((e) => Setting.toJSON(e))
    }
    if (message.streamId !== 0) {
      obj.streamId = Math.round(message.streamId)
    }
    if (message.lastStreamIdReceived !== 0) {
      obj.lastStreamIdReceived = Math.round(message.lastStreamIdReceived)
    }
    if (message.heartbeatConfig !== undefined) {
      obj.heartbeatConfig = HeartbeatConfig.toJSON(message.heartbeatConfig)
    }
    if (message.serverTimestamp !== BigInt('0')) {
      obj.serverTimestamp = message.serverTimestamp.toString()
    }
    return obj
  },

  create<I extends Exact<DeepPartial<LoginResponse>, I>>(base?: I): LoginResponse {
    return LoginResponse.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<LoginResponse>, I>>(object: I): LoginResponse {
    const message = createBaseLoginResponse()
    message.id = object.id ?? ''
    message.jid = object.jid ?? ''
    message.error = object.error !== undefined && object.error !== null ? ErrorInfo.fromPartial(object.error) : undefined
    message.setting = object.setting?.map((e) => Setting.fromPartial(e)) || []
    message.streamId = object.streamId ?? 0
    message.lastStreamIdReceived = object.lastStreamIdReceived ?? 0
    message.heartbeatConfig =
      object.heartbeatConfig !== undefined && object.heartbeatConfig !== null ? HeartbeatConfig.fromPartial(object.heartbeatConfig) : undefined
    message.serverTimestamp = object.serverTimestamp ?? BigInt('0')
    return message
  }
}

function createBaseStreamErrorStanza(): StreamErrorStanza {
  return { type: '', text: '' }
}

export const StreamErrorStanza = {
  encode(message: StreamErrorStanza, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== '') {
      writer.uint32(10).string(message.type)
    }
    if (message.text !== '') {
      writer.uint32(18).string(message.text)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamErrorStanza {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseStreamErrorStanza()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.type = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.text = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): StreamErrorStanza {
    return {
      type: isSet(object.type) ? globalThis.String(object.type) : '',
      text: isSet(object.text) ? globalThis.String(object.text) : ''
    }
  },

  toJSON(message: StreamErrorStanza): unknown {
    const obj: any = {}
    if (message.type !== '') {
      obj.type = message.type
    }
    if (message.text !== '') {
      obj.text = message.text
    }
    return obj
  },

  create<I extends Exact<DeepPartial<StreamErrorStanza>, I>>(base?: I): StreamErrorStanza {
    return StreamErrorStanza.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<StreamErrorStanza>, I>>(object: I): StreamErrorStanza {
    const message = createBaseStreamErrorStanza()
    message.type = object.type ?? ''
    message.text = object.text ?? ''
    return message
  }
}

function createBaseClose(): Close {
  return {}
}

export const Close = {
  encode(_: Close, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Close {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseClose()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(_: any): Close {
    return {}
  },

  toJSON(_: Close): unknown {
    const obj: any = {}
    return obj
  },

  create<I extends Exact<DeepPartial<Close>, I>>(base?: I): Close {
    return Close.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<Close>, I>>(_: I): Close {
    const message = createBaseClose()
    return message
  }
}

function createBaseExtension(): Extension {
  return { id: 0, data: new Uint8Array(0) }
}

export const Extension = {
  encode(message: Extension, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id)
    }
    if (message.data.length !== 0) {
      writer.uint32(18).bytes(message.data)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Extension {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseExtension()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }

          message.id = reader.int32()
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.data = reader.bytes()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): Extension {
    return {
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
      data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(0)
    }
  },

  toJSON(message: Extension): unknown {
    const obj: any = {}
    if (message.id !== 0) {
      obj.id = Math.round(message.id)
    }
    if (message.data.length !== 0) {
      obj.data = base64FromBytes(message.data)
    }
    return obj
  },

  create<I extends Exact<DeepPartial<Extension>, I>>(base?: I): Extension {
    return Extension.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<Extension>, I>>(object: I): Extension {
    const message = createBaseExtension()
    message.id = object.id ?? 0
    message.data = object.data ?? new Uint8Array(0)
    return message
  }
}

function createBaseIqStanza(): IqStanza {
  return {
    rmqId: BigInt('0'),
    type: 0,
    id: '',
    from: '',
    to: '',
    error: undefined,
    extension: undefined,
    persistentId: '',
    streamId: 0,
    lastStreamIdReceived: 0,
    accountId: BigInt('0'),
    status: BigInt('0')
  }
}

export const IqStanza = {
  encode(message: IqStanza, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.rmqId !== BigInt('0')) {
      if (BigInt.asIntN(64, message.rmqId) !== message.rmqId) {
        throw new Error('value provided for field message.rmqId of type int64 too large')
      }
      writer.uint32(8).int64(message.rmqId.toString())
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type)
    }
    if (message.id !== '') {
      writer.uint32(26).string(message.id)
    }
    if (message.from !== '') {
      writer.uint32(34).string(message.from)
    }
    if (message.to !== '') {
      writer.uint32(42).string(message.to)
    }
    if (message.error !== undefined) {
      ErrorInfo.encode(message.error, writer.uint32(50).fork()).ldelim()
    }
    if (message.extension !== undefined) {
      Extension.encode(message.extension, writer.uint32(58).fork()).ldelim()
    }
    if (message.persistentId !== '') {
      writer.uint32(66).string(message.persistentId)
    }
    if (message.streamId !== 0) {
      writer.uint32(72).int32(message.streamId)
    }
    if (message.lastStreamIdReceived !== 0) {
      writer.uint32(80).int32(message.lastStreamIdReceived)
    }
    if (message.accountId !== BigInt('0')) {
      if (BigInt.asIntN(64, message.accountId) !== message.accountId) {
        throw new Error('value provided for field message.accountId of type int64 too large')
      }
      writer.uint32(88).int64(message.accountId.toString())
    }
    if (message.status !== BigInt('0')) {
      if (BigInt.asIntN(64, message.status) !== message.status) {
        throw new Error('value provided for field message.status of type int64 too large')
      }
      writer.uint32(96).int64(message.status.toString())
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IqStanza {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseIqStanza()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break
          }

          message.rmqId = longToBigint(reader.int64() as Long)
          continue
        case 2:
          if (tag !== 16) {
            break
          }

          message.type = reader.int32() as any
          continue
        case 3:
          if (tag !== 26) {
            break
          }

          message.id = reader.string()
          continue
        case 4:
          if (tag !== 34) {
            break
          }

          message.from = reader.string()
          continue
        case 5:
          if (tag !== 42) {
            break
          }

          message.to = reader.string()
          continue
        case 6:
          if (tag !== 50) {
            break
          }

          message.error = ErrorInfo.decode(reader, reader.uint32())
          continue
        case 7:
          if (tag !== 58) {
            break
          }

          message.extension = Extension.decode(reader, reader.uint32())
          continue
        case 8:
          if (tag !== 66) {
            break
          }

          message.persistentId = reader.string()
          continue
        case 9:
          if (tag !== 72) {
            break
          }

          message.streamId = reader.int32()
          continue
        case 10:
          if (tag !== 80) {
            break
          }

          message.lastStreamIdReceived = reader.int32()
          continue
        case 11:
          if (tag !== 88) {
            break
          }

          message.accountId = longToBigint(reader.int64() as Long)
          continue
        case 12:
          if (tag !== 96) {
            break
          }

          message.status = longToBigint(reader.int64() as Long)
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): IqStanza {
    return {
      rmqId: isSet(object.rmqId) ? BigInt(object.rmqId) : BigInt('0'),
      type: isSet(object.type) ? iqStanza_IqTypeFromJSON(object.type) : 0,
      id: isSet(object.id) ? globalThis.String(object.id) : '',
      from: isSet(object.from) ? globalThis.String(object.from) : '',
      to: isSet(object.to) ? globalThis.String(object.to) : '',
      error: isSet(object.error) ? ErrorInfo.fromJSON(object.error) : undefined,
      extension: isSet(object.extension) ? Extension.fromJSON(object.extension) : undefined,
      persistentId: isSet(object.persistentId) ? globalThis.String(object.persistentId) : '',
      streamId: isSet(object.streamId) ? globalThis.Number(object.streamId) : 0,
      lastStreamIdReceived: isSet(object.lastStreamIdReceived) ? globalThis.Number(object.lastStreamIdReceived) : 0,
      accountId: isSet(object.accountId) ? BigInt(object.accountId) : BigInt('0'),
      status: isSet(object.status) ? BigInt(object.status) : BigInt('0')
    }
  },

  toJSON(message: IqStanza): unknown {
    const obj: any = {}
    if (message.rmqId !== BigInt('0')) {
      obj.rmqId = message.rmqId.toString()
    }
    if (message.type !== 0) {
      obj.type = iqStanza_IqTypeToJSON(message.type)
    }
    if (message.id !== '') {
      obj.id = message.id
    }
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.to !== '') {
      obj.to = message.to
    }
    if (message.error !== undefined) {
      obj.error = ErrorInfo.toJSON(message.error)
    }
    if (message.extension !== undefined) {
      obj.extension = Extension.toJSON(message.extension)
    }
    if (message.persistentId !== '') {
      obj.persistentId = message.persistentId
    }
    if (message.streamId !== 0) {
      obj.streamId = Math.round(message.streamId)
    }
    if (message.lastStreamIdReceived !== 0) {
      obj.lastStreamIdReceived = Math.round(message.lastStreamIdReceived)
    }
    if (message.accountId !== BigInt('0')) {
      obj.accountId = message.accountId.toString()
    }
    if (message.status !== BigInt('0')) {
      obj.status = message.status.toString()
    }
    return obj
  },

  create<I extends Exact<DeepPartial<IqStanza>, I>>(base?: I): IqStanza {
    return IqStanza.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<IqStanza>, I>>(object: I): IqStanza {
    const message = createBaseIqStanza()
    message.rmqId = object.rmqId ?? BigInt('0')
    message.type = object.type ?? 0
    message.id = object.id ?? ''
    message.from = object.from ?? ''
    message.to = object.to ?? ''
    message.error = object.error !== undefined && object.error !== null ? ErrorInfo.fromPartial(object.error) : undefined
    message.extension = object.extension !== undefined && object.extension !== null ? Extension.fromPartial(object.extension) : undefined
    message.persistentId = object.persistentId ?? ''
    message.streamId = object.streamId ?? 0
    message.lastStreamIdReceived = object.lastStreamIdReceived ?? 0
    message.accountId = object.accountId ?? BigInt('0')
    message.status = object.status ?? BigInt('0')
    return message
  }
}

function createBaseAppData(): AppData {
  return { key: '', value: '' }
}

export const AppData = {
  encode(message: AppData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key)
    }
    if (message.value !== '') {
      writer.uint32(18).string(message.value)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AppData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseAppData()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.key = reader.string()
          continue
        case 2:
          if (tag !== 18) {
            break
          }

          message.value = reader.string()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): AppData {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : '',
      value: isSet(object.value) ? globalThis.String(object.value) : ''
    }
  },

  toJSON(message: AppData): unknown {
    const obj: any = {}
    if (message.key !== '') {
      obj.key = message.key
    }
    if (message.value !== '') {
      obj.value = message.value
    }
    return obj
  },

  create<I extends Exact<DeepPartial<AppData>, I>>(base?: I): AppData {
    return AppData.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<AppData>, I>>(object: I): AppData {
    const message = createBaseAppData()
    message.key = object.key ?? ''
    message.value = object.value ?? ''
    return message
  }
}

function createBaseDataMessageStanza(): DataMessageStanza {
  return {
    id: '',
    from: '',
    to: '',
    category: '',
    token: '',
    appData: [],
    fromTrustedServer: false,
    persistentId: '',
    streamId: 0,
    lastStreamIdReceived: 0,
    regId: '',
    deviceUserId: BigInt('0'),
    ttl: 0,
    sent: BigInt('0'),
    queued: 0,
    status: BigInt('0'),
    rawData: new Uint8Array(0),
    immediateAck: false
  }
}

export const DataMessageStanza = {
  encode(message: DataMessageStanza, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(18).string(message.id)
    }
    if (message.from !== '') {
      writer.uint32(26).string(message.from)
    }
    if (message.to !== '') {
      writer.uint32(34).string(message.to)
    }
    if (message.category !== '') {
      writer.uint32(42).string(message.category)
    }
    if (message.token !== '') {
      writer.uint32(50).string(message.token)
    }
    for (const v of message.appData) {
      AppData.encode(v!, writer.uint32(58).fork()).ldelim()
    }
    if (message.fromTrustedServer === true) {
      writer.uint32(64).bool(message.fromTrustedServer)
    }
    if (message.persistentId !== '') {
      writer.uint32(74).string(message.persistentId)
    }
    if (message.streamId !== 0) {
      writer.uint32(80).int32(message.streamId)
    }
    if (message.lastStreamIdReceived !== 0) {
      writer.uint32(88).int32(message.lastStreamIdReceived)
    }
    if (message.regId !== '') {
      writer.uint32(106).string(message.regId)
    }
    if (message.deviceUserId !== BigInt('0')) {
      if (BigInt.asIntN(64, message.deviceUserId) !== message.deviceUserId) {
        throw new Error('value provided for field message.deviceUserId of type int64 too large')
      }
      writer.uint32(128).int64(message.deviceUserId.toString())
    }
    if (message.ttl !== 0) {
      writer.uint32(136).int32(message.ttl)
    }
    if (message.sent !== BigInt('0')) {
      if (BigInt.asIntN(64, message.sent) !== message.sent) {
        throw new Error('value provided for field message.sent of type int64 too large')
      }
      writer.uint32(144).int64(message.sent.toString())
    }
    if (message.queued !== 0) {
      writer.uint32(152).int32(message.queued)
    }
    if (message.status !== BigInt('0')) {
      if (BigInt.asIntN(64, message.status) !== message.status) {
        throw new Error('value provided for field message.status of type int64 too large')
      }
      writer.uint32(160).int64(message.status.toString())
    }
    if (message.rawData.length !== 0) {
      writer.uint32(170).bytes(message.rawData)
    }
    if (message.immediateAck === true) {
      writer.uint32(192).bool(message.immediateAck)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DataMessageStanza {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseDataMessageStanza()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 2:
          if (tag !== 18) {
            break
          }

          message.id = reader.string()
          continue
        case 3:
          if (tag !== 26) {
            break
          }

          message.from = reader.string()
          continue
        case 4:
          if (tag !== 34) {
            break
          }

          message.to = reader.string()
          continue
        case 5:
          if (tag !== 42) {
            break
          }

          message.category = reader.string()
          continue
        case 6:
          if (tag !== 50) {
            break
          }

          message.token = reader.string()
          continue
        case 7:
          if (tag !== 58) {
            break
          }

          message.appData.push(AppData.decode(reader, reader.uint32()))
          continue
        case 8:
          if (tag !== 64) {
            break
          }

          message.fromTrustedServer = reader.bool()
          continue
        case 9:
          if (tag !== 74) {
            break
          }

          message.persistentId = reader.string()
          continue
        case 10:
          if (tag !== 80) {
            break
          }

          message.streamId = reader.int32()
          continue
        case 11:
          if (tag !== 88) {
            break
          }

          message.lastStreamIdReceived = reader.int32()
          continue
        case 13:
          if (tag !== 106) {
            break
          }

          message.regId = reader.string()
          continue
        case 16:
          if (tag !== 128) {
            break
          }

          message.deviceUserId = longToBigint(reader.int64() as Long)
          continue
        case 17:
          if (tag !== 136) {
            break
          }

          message.ttl = reader.int32()
          continue
        case 18:
          if (tag !== 144) {
            break
          }

          message.sent = longToBigint(reader.int64() as Long)
          continue
        case 19:
          if (tag !== 152) {
            break
          }

          message.queued = reader.int32()
          continue
        case 20:
          if (tag !== 160) {
            break
          }

          message.status = longToBigint(reader.int64() as Long)
          continue
        case 21:
          if (tag !== 170) {
            break
          }

          message.rawData = reader.bytes()
          continue
        case 24:
          if (tag !== 192) {
            break
          }

          message.immediateAck = reader.bool()
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): DataMessageStanza {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : '',
      from: isSet(object.from) ? globalThis.String(object.from) : '',
      to: isSet(object.to) ? globalThis.String(object.to) : '',
      category: isSet(object.category) ? globalThis.String(object.category) : '',
      token: isSet(object.token) ? globalThis.String(object.token) : '',
      appData: globalThis.Array.isArray(object?.appData) ? object.appData.map((e: any) => AppData.fromJSON(e)) : [],
      fromTrustedServer: isSet(object.fromTrustedServer) ? globalThis.Boolean(object.fromTrustedServer) : false,
      persistentId: isSet(object.persistentId) ? globalThis.String(object.persistentId) : '',
      streamId: isSet(object.streamId) ? globalThis.Number(object.streamId) : 0,
      lastStreamIdReceived: isSet(object.lastStreamIdReceived) ? globalThis.Number(object.lastStreamIdReceived) : 0,
      regId: isSet(object.regId) ? globalThis.String(object.regId) : '',
      deviceUserId: isSet(object.deviceUserId) ? BigInt(object.deviceUserId) : BigInt('0'),
      ttl: isSet(object.ttl) ? globalThis.Number(object.ttl) : 0,
      sent: isSet(object.sent) ? BigInt(object.sent) : BigInt('0'),
      queued: isSet(object.queued) ? globalThis.Number(object.queued) : 0,
      status: isSet(object.status) ? BigInt(object.status) : BigInt('0'),
      rawData: isSet(object.rawData) ? bytesFromBase64(object.rawData) : new Uint8Array(0),
      immediateAck: isSet(object.immediateAck) ? globalThis.Boolean(object.immediateAck) : false
    }
  },

  toJSON(message: DataMessageStanza): unknown {
    const obj: any = {}
    if (message.id !== '') {
      obj.id = message.id
    }
    if (message.from !== '') {
      obj.from = message.from
    }
    if (message.to !== '') {
      obj.to = message.to
    }
    if (message.category !== '') {
      obj.category = message.category
    }
    if (message.token !== '') {
      obj.token = message.token
    }
    if (message.appData?.length) {
      obj.appData = message.appData.map((e) => AppData.toJSON(e))
    }
    if (message.fromTrustedServer === true) {
      obj.fromTrustedServer = message.fromTrustedServer
    }
    if (message.persistentId !== '') {
      obj.persistentId = message.persistentId
    }
    if (message.streamId !== 0) {
      obj.streamId = Math.round(message.streamId)
    }
    if (message.lastStreamIdReceived !== 0) {
      obj.lastStreamIdReceived = Math.round(message.lastStreamIdReceived)
    }
    if (message.regId !== '') {
      obj.regId = message.regId
    }
    if (message.deviceUserId !== BigInt('0')) {
      obj.deviceUserId = message.deviceUserId.toString()
    }
    if (message.ttl !== 0) {
      obj.ttl = Math.round(message.ttl)
    }
    if (message.sent !== BigInt('0')) {
      obj.sent = message.sent.toString()
    }
    if (message.queued !== 0) {
      obj.queued = Math.round(message.queued)
    }
    if (message.status !== BigInt('0')) {
      obj.status = message.status.toString()
    }
    if (message.rawData.length !== 0) {
      obj.rawData = base64FromBytes(message.rawData)
    }
    if (message.immediateAck === true) {
      obj.immediateAck = message.immediateAck
    }
    return obj
  },

  create<I extends Exact<DeepPartial<DataMessageStanza>, I>>(base?: I): DataMessageStanza {
    return DataMessageStanza.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<DataMessageStanza>, I>>(object: I): DataMessageStanza {
    const message = createBaseDataMessageStanza()
    message.id = object.id ?? ''
    message.from = object.from ?? ''
    message.to = object.to ?? ''
    message.category = object.category ?? ''
    message.token = object.token ?? ''
    message.appData = object.appData?.map((e) => AppData.fromPartial(e)) || []
    message.fromTrustedServer = object.fromTrustedServer ?? false
    message.persistentId = object.persistentId ?? ''
    message.streamId = object.streamId ?? 0
    message.lastStreamIdReceived = object.lastStreamIdReceived ?? 0
    message.regId = object.regId ?? ''
    message.deviceUserId = object.deviceUserId ?? BigInt('0')
    message.ttl = object.ttl ?? 0
    message.sent = object.sent ?? BigInt('0')
    message.queued = object.queued ?? 0
    message.status = object.status ?? BigInt('0')
    message.rawData = object.rawData ?? new Uint8Array(0)
    message.immediateAck = object.immediateAck ?? false
    return message
  }
}

function createBaseStreamAck(): StreamAck {
  return {}
}

export const StreamAck = {
  encode(_: StreamAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamAck {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseStreamAck()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(_: any): StreamAck {
    return {}
  },

  toJSON(_: StreamAck): unknown {
    const obj: any = {}
    return obj
  },

  create<I extends Exact<DeepPartial<StreamAck>, I>>(base?: I): StreamAck {
    return StreamAck.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<StreamAck>, I>>(_: I): StreamAck {
    const message = createBaseStreamAck()
    return message
  }
}

function createBaseSelectiveAck(): SelectiveAck {
  return { id: [] }
}

export const SelectiveAck = {
  encode(message: SelectiveAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.id) {
      writer.uint32(10).string(v!)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SelectiveAck {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseSelectiveAck()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break
          }

          message.id.push(reader.string())
          continue
      }
      if ((tag & 7) === 4 || tag === 0) {
        break
      }
      reader.skipType(tag & 7)
    }
    return message
  },

  fromJSON(object: any): SelectiveAck {
    return { id: globalThis.Array.isArray(object?.id) ? object.id.map((e: any) => globalThis.String(e)) : [] }
  },

  toJSON(message: SelectiveAck): unknown {
    const obj: any = {}
    if (message.id?.length) {
      obj.id = message.id
    }
    return obj
  },

  create<I extends Exact<DeepPartial<SelectiveAck>, I>>(base?: I): SelectiveAck {
    return SelectiveAck.fromPartial(base ?? ({} as any))
  },
  fromPartial<I extends Exact<DeepPartial<SelectiveAck>, I>>(object: I): SelectiveAck {
    const message = createBaseSelectiveAck()
    message.id = object.id?.map((e) => e) || []
    return message
  }
}

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, 'base64'))
  } else {
    const bin = globalThis.atob(b64)
    const arr = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i)
    }
    return arr
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString('base64')
  } else {
    const bin: string[] = []
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte))
    })
    return globalThis.btoa(bin.join(''))
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends globalThis.Array<infer U>
    ? globalThis.Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T extends {}
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : Partial<T>

type KeysOfUnion<T> = T extends T ? keyof T : never
export type Exact<P, I extends P> = P extends Builtin ? P : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never }

function longToBigint(long: Long) {
  return BigInt(long.toString())
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined
}
