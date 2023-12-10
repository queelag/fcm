// import type { ECDH } from 'crypto'

// interface ECEParams {
//   authSecret?: string
//   dh?: ECDH
//   keylabel?: 'P-256'
//   keymap?: Record<string, unknown>
//   privateKey?: string
//   key?: string
//   keyid?: string
//   rs?: number
//   salt?: string
//   version?: 'aes128gcm' | 'aesgcm' | 'aesgcm128'
// }

// type KeyLookupCallback = (keyid: string) => any

declare module 'http_ece' {
  function decrypt(buffer: Buffer, params: object, keyLookupCallback?: Function): Buffer
  function encrypt(buffer: Buffer, params: object, keyLookupCallback?: Function): Buffer
}
