import { ECDH, createECDH, randomBytes } from 'crypto'
import { FCM_ECDH_CURVE_NAME } from '../definitions/constants.js'

/**
 * Creates a new ECDH instance with the prime256v1 curve and generates a new key pair.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/fcm/utils/crypto)
 */
export function createFcmECDH(): ECDH {
  let ecdh: ECDH

  ecdh = createECDH(FCM_ECDH_CURVE_NAME)
  ecdh.generateKeys()

  return ecdh
}

/**
 * Generates a new FCM auth secret.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/fcm/utils/crypto)
 */
export function generateFcmAuthSecret(): Uint8Array {
  return randomBytes(16)
}
