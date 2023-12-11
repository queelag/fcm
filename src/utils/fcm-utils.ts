import { ECDH, createECDH, randomBytes } from 'crypto'

export function createFCMPrime256v1ECDH(): ECDH {
  let ecdh: ECDH

  ecdh = createECDH('prime256v1')
  ecdh.generateKeys()

  return ecdh
}

export function generateFCMSalt(): Uint8Array {
  return randomBytes(16)
}
