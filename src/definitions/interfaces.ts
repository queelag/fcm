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

export interface FCMClientCrypto {
  privateKey: Uint8Array
  salt: Uint8Array
}

export interface FCMClientData {
  cursor: number
  heartbeat?: MCS.HeartbeatAck
  login?: MCS.LoginResponse
  size: {
    expected: number
    packets: number
  }
  state: MCSState
  tag: MCSTag
  value: Buffer
  version: number
}

export interface FCMSubscription {
  acg: {
    id: bigint
    securityToken: bigint
  }
  token: string
}

export interface Notification<T extends object = object> {
  from: string
  notification: T
  priority: string
}
