/* eslint-disable */
import Long from 'long'
import _m0 from 'protobufjs/minimal.js'

export namespace MCS {
  export const protobufPackage = 'mcs_proto'

  /** TAG: 0 */
  export interface HeartbeatPing {
    stream_id: number
    last_stream_id_received: number
    status: Long
  }

  /** TAG: 1 */
  export interface HeartbeatAck {
    stream_id: number
    last_stream_id_received: number
    status: Long
  }

  export interface ErrorInfo {
    code: number
    message: string
    type: string
    extension: Extension | undefined
  }

  export interface Setting {
    name: string
    value: string
  }

  export interface HeartbeatStat {
    ip: string
    timeout: boolean
    interval_ms: number
  }

  export interface HeartbeatConfig {
    upload_stat: boolean
    ip: string
    interval_ms: number
  }

  /**
   * ClientEvents are used to inform the server of failed and successful
   * connections.
   */
  export interface ClientEvent {
    /** Common fields [1-99] */
    type: ClientEventType
    /** Fields for DISCARDED_EVENTS messages [100-199] */
    number_discarded_events: number
    /**
     * Fields for FAILED_CONNECTION and SUCCESSFUL_CONNECTION messages [200-299]
     * Network type is a value in net::NetworkChangeNotifier::ConnectionType.
     */
    network_type: number
    time_connection_started_ms: Long
    time_connection_ended_ms: Long
    /** Error code should be a net::Error value. */
    error_code: number
    /** Fields for SUCCESSFUL_CONNECTION messages [300-399] */
    time_connection_established_ms: Long
  }

  export enum ClientEventType {
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
    auth_token: string
    /**
     * Format is: android-HEX_DEVICE_ID
     * The user is the decimal value.
     */
    device_id: string
    /** RMQ1 - no longer used */
    last_rmq_id: Long
    setting: Setting[]
    /** optional int32 compress = 9; */
    received_persistent_id: string[]
    adaptive_heartbeat: boolean
    heartbeat_stat: HeartbeatStat | undefined
    /** Must be true. */
    use_rmq2: boolean
    account_id: Long
    /** ANDROID_ID = 2 */
    auth_service: LoginRequestAuthService
    network_type: number
    status: Long
    /** Events recorded on the client after the last successful connection. */
    client_event: ClientEvent[]
  }

  export enum LoginRequestAuthService {
    ANDROID_ID = 2,
    UNRECOGNIZED = -1
  }

  /** TAG: 3 */
  export interface LoginResponse {
    id: string
    /** Not used. */
    jid: string
    /** Null if login was ok. */
    error: ErrorInfo | undefined
    setting: Setting[]
    stream_id: number
    /** Should be "1" */
    last_stream_id_received: number
    heartbeat_config: HeartbeatConfig | undefined
    /** used by the client to synchronize with the server timestamp. */
    server_timestamp: Long
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
    rmq_id: Long
    type: IqStanzaIqType
    id: string
    from: string
    to: string
    error: ErrorInfo | undefined
    /** Only field used in the 38+ protocol (besides common last_stream_id_received, status, rmq_id) */
    extension: Extension | undefined
    persistent_id: string
    stream_id: number
    last_stream_id_received: number
    account_id: Long
    status: Long
  }

  export enum IqStanzaIqType {
    GET = 0,
    SET = 1,
    RESULT = 2,
    IQ_ERROR = 3,
    UNRECOGNIZED = -1
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
    app_data: AppData[]
    /** Not used. */
    from_trusted_server: boolean
    /**
     * Part of the ACK protocol, returned in DataMessageResponse on server side.
     * It's part of the key of DMP.
     */
    persistent_id: string
    /**
     * In-stream ack. Increments on each message sent - a bit redundant
     * Not used in DMP/DMR.
     */
    stream_id: number
    last_stream_id_received: number
    /** Sent by the device shortly after registration. */
    reg_id: string
    /**
     * serial number of the target user, DMP.8
     * It is the 'serial number' according to user manager.
     */
    device_user_id: Long
    /** Time to live, in seconds. */
    ttl: number
    /** Timestamp ( according to client ) when message was sent by app, in seconds */
    sent: Long
    /**
     * How long has the message been queued before the flush, in seconds.
     * This is needed to account for the time difference between server and
     * client: server should adjust 'sent' based on its 'receive' time.
     */
    queued: number
    status: Long
    /** Optional field containing the binary payload of the message. */
    raw_data: Uint8Array
    /**
     * If set the server requests immediate ack. Used for important messages and
     * for testing.
     */
    immediate_ack: boolean
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
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}
