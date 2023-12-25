import { Storage } from '@aracna/core'
import { FcmApiDefinitions } from './apis/fcm-api-definitions.js'
import { McsState, McsTag } from './enums.js'
import { CheckinDefinitions } from './proto/checkin-definitions.js'
import { McsDefinitions } from './proto/mcs-definitions.js'
import { FcmApiNotification } from './types.js'

export interface AcgCheckinResponse extends Omit<CheckinDefinitions.AndroidCheckinResponse, 'android_id' | 'security_token'> {
  android_id: bigint
  security_token: bigint
}

export interface EventEmitterEventMap extends Record<string | symbol, (...args: any[]) => any> {}

export interface FcmApiError extends FcmApiDefinitions.V1.Error {}
export interface FcmApiMessage<T extends object = object> extends FcmApiDefinitions.V1.Message<T> {}

export interface FcmClientACG {
  id: bigint
  securityToken: bigint
}

export interface FcmClientECDH {
  privateKey: ArrayLike<number>
  salt: ArrayLike<number>
}

export interface FcmClientData {
  cursor: number
  heartbeat?: McsDefinitions.HeartbeatAck
  login?: McsDefinitions.LoginResponse
  received: {
    pids: string[]
  }
  size: {
    packets: number
  }
  state: McsState
  tag: McsTag
  value: Buffer
  version: number
}

export interface FcmClientHeartbeat extends McsDefinitions.HeartbeatAck {}
export interface FcmClientIq extends McsDefinitions.IqStanza {}

export interface FcmClientInit {
  acg?: FcmClientACG
  ecdh?: FcmClientECDH
  storage?: {
    instance?: Storage
    key?: string
  }
}

export interface FcmClientLogin extends McsDefinitions.LoginResponse {}
export interface FcmClientMessage extends McsDefinitions.DataMessageStanza {}

export interface FcmClientMessageData<T extends FcmApiNotification = FcmApiNotification> {
  fcmMessageId: string
  from: string
  notification?: T
  priority: string
}

export interface FcmClientEvents extends EventEmitterEventMap {
  close: () => any
  heartbeat: (heartbeat: FcmClientHeartbeat) => any
  iq: (iq: FcmClientIq) => any
  login: (login: FcmClientLogin) => any
  message: (message: FcmClientMessage) => any
  'message-data': (data: FcmClientMessageData) => any
}

export interface FcmRegistration {
  acg: {
    id: bigint
    securityToken: bigint
  }
  token: string
}

export interface FcmSubscription extends FcmRegistration {}

export interface GoogleServiceAccount {
  client_email: string
  private_key: string
}

export interface RegisterToFcmConfig {
  acg?: {
    id?: bigint
    securityToken?: bigint
  }
  appID: string
  ecdh: {
    publicKey: ArrayLike<number>
    salt: ArrayLike<number>
  }
  firebase: {
    apiKey: string
    appID: string
    projectID: string
  }
  vapidKey: string
}

export interface SubscribeToFcmConfig {
  acg?: {
    id?: bigint
    securityToken?: bigint
  }
  appID: string
  ecdh: {
    publicKey: ArrayLike<number>
    salt: ArrayLike<number>
  }
  senderID: string
}
