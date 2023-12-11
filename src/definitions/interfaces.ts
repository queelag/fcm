import { MCSState, MCSTag } from './enums.js'
import { Checkin } from './proto/checkin.js'
import { MCS } from './proto/mcs.js'

export interface ACGCheckinResponse extends Omit<Checkin.AndroidCheckinResponse, 'android_id' | 'security_token'> {
  android_id: bigint
  security_token: bigint
}

export interface FCMClientACG {
  id: bigint
  securityToken: bigint
}

export interface FCMClientECDH {
  privateKey: Uint8Array
  salt: Uint8Array
}

export interface FCMClientData {
  cursor: number
  heartbeat?: MCS.HeartbeatAck
  login?: MCS.LoginResponse
  size: {
    packets: number
  }
  state: MCSState
  tag: MCSTag
  value: Buffer
  version: number
}

export interface FCMRegistration {
  acg: {
    id: bigint
    securityToken: bigint
  }
  token: string
}

export interface FCMSubscription extends FCMRegistration {}

export interface Message<T extends object = object> {
  from: string
  notification: T
  priority: string
}

export interface RegisterToFCMConfig {
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

export interface SubscribeToFCMConfig {
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
