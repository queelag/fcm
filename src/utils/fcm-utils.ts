import { ECDH, createECDH, randomBytes } from 'crypto'

export function createFcmECDH(): ECDH {
  let ecdh: ECDH

  ecdh = createECDH('prime256v1')
  ecdh.generateKeys()

  return ecdh
}

export function generateFcmSalt(): Uint8Array {
  return randomBytes(16)
}
