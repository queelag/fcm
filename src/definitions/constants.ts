import protobuf, { Root } from 'protobufjs'
import { MCSState, MCSTag } from './enums.js'
import { FcmClientACG, FcmClientData, FcmClientECDH } from './interfaces.js'

/**
 * ACG
 */
/** */
export const ACG_REGISTER_CHROME_VERSION: string = '87.0.4280.66'
export const ACG_REGISTER_SENDER: number[] = [
  0x04, 0x33, 0x94, 0xf7, 0xdf, 0xa1, 0xeb, 0xb1, 0xdc, 0x03, 0xa2, 0x5e, 0x15, 0x71, 0xdb, 0x48, 0xd3, 0x2e, 0xed, 0xed, 0xb2, 0x34, 0xdb, 0xb7, 0x47, 0x3a,
  0x0c, 0x8f, 0xc4, 0xcc, 0xe1, 0x6f, 0x3c, 0x8c, 0x84, 0xdf, 0xab, 0xb6, 0x66, 0x3e, 0xf2, 0x0c, 0xd4, 0x8b, 0xfe, 0xe3, 0xf9, 0x76, 0x2f, 0x14, 0x1c, 0x63,
  0x08, 0x6a, 0x6f, 0x2d, 0xb1, 0x1a, 0x95, 0xb0, 0xce, 0x37, 0xc0, 0x9c, 0x6e
]

/**
 * GOOGLE AUTH
 */
/** */
export const GOOGLE_AUTH_JWT_SCOPES: string[] = ['https://www.googleapis.com/auth/firebase.messaging']

/**
 * MTALK
 */
/** */
export const MTALK_GOOGLE_HOST: string = 'mtalk.google.com'
export const MTALK_GOOGLE_PORT: number = 5228

/**
 * MCS
 */
/** */
export const MCS_HEARTBEAT_PING_TIMEOUT_MS: number = 5000
export const MCS_SIZE_PACKET_MAX_LENGTH: number = 5
export const MCS_SIZE_PACKET_MIN_LENGTH: number = 1
export const MCS_TAG_PACKET_LENGTH: number = 1
export const MCS_VERSION: number = 41
export const MCS_VERSION_PACKET_LENGTH: number = 1

/**
 * FCM CLIENT
 */
/** */
export const DEFAULT_FCM_CLIENT_ACG: () => FcmClientACG = () => ({
  id: 0n,
  securityToken: 0n
})
export const DEFAULT_FCM_CLIENT_ECDH: () => FcmClientECDH = () => ({
  privateKey: [],
  salt: []
})
export const DEFAULT_FCM_CLIENT_DATA: () => FcmClientData = () => ({
  cursor: 0,
  received: { pids: [] },
  size: { packets: MCS_SIZE_PACKET_MIN_LENGTH },
  state: MCSState.VERSION_TAG_AND_SIZE,
  tag: MCSTag.LOGIN_RESPONSE,
  value: Buffer.alloc(0),
  version: 0
})
export const DEFAULT_FCM_CLIENT_STORAGE_KEY: string = 'aracna_fcm_client'

/**
 * PROTOBUF
 */
/** */
export const PROTOBUF_ROOT: Root = new protobuf.Root()
