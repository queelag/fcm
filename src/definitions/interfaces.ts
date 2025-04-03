import { Storage } from '@aracna/core'
import { FcmApiDefinitions } from './apis/fcm-api-definitions.js'
import { FcmTopicsApiDefinitions } from './apis/fcm-topics-api-definitions.js'
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

export interface FcmClientECE {
  authSecret: ArrayLike<number>
  privateKey: ArrayLike<number>
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
  ece?: FcmClientECE
  heartbeat?: {
    frequency?: number
  }
  storage?: {
    instance?: Storage
    key?: string
  }
}

export interface FcmClientLogin extends McsDefinitions.LoginResponse {}
export interface FcmClientMessage extends McsDefinitions.DataMessageStanza {}

export interface FcmClientMessageData<T extends Record<string, string> = Record<string, string>, U extends object = object> {
  data?: T
  fcmMessageId: string
  from: string
  notification?: FcmApiNotification<U>
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

export interface FcmClientOptions {
  heartbeat: {
    frequency: number
  }
}

export interface FcmRegistration {
  acg: {
    id: bigint
    securityToken: bigint
  }
  token: string
}

export interface FcmSubscription extends FcmRegistration {}

export interface FcmTopicSubscription extends FcmTopicsApiDefinitions.BatchAddResponseData {}
export interface FcmTopicUnsubscription extends FcmTopicsApiDefinitions.BatchRemoveResponseData {}

export interface GoogleServiceAccount {
  client_email: string
  private_key: string
  project_id: string
}

export interface GoogleServiceAccountWithoutProjectID extends Omit<GoogleServiceAccount, 'project_id'> {}

export interface PostAcgRegisterOptions {
  retry?: {
    delay?: number
    max?: number
  }
}

export interface RegisterToFcmConfig {
  acg?: {
    id?: bigint
    securityToken?: bigint
  }
  appID: string
  ece: {
    authSecret: ArrayLike<number>
    publicKey: ArrayLike<number>
  }
  firebase: {
    apiKey: string
    appID: string
    projectID: string
  }
  vapidKey?: string
}

export interface RegisterToFcmOptions {
  acg?: {
    register?: PostAcgRegisterOptions
  }
}

export interface SubscribeToFcmConfig {
  acg?: {
    id?: bigint
    securityToken?: bigint
  }
  appID: string
  ece: {
    authSecret: ArrayLike<number>
    publicKey: ArrayLike<number>
  }
  senderID: string
}

export interface SubscribeToFcmOptions {
  acg?: {
    register?: PostAcgRegisterOptions
  }
}
