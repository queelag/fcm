import { HeartbeatAck, LoginResponse } from '../protos/mcs.js'
import { MCSState, MCSTag } from './enums.js'

export interface FCMClientACG {
  id: bigint
  securityToken: bigint
}

export interface FCMClientCrypto {
  privateKey: Uint8Array
  salt: Uint8Array
}

export interface FCMClientData {
  heartbeat?: HeartbeatAck
  login?: LoginResponse
  size: {
    expected: number
    received: number
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
