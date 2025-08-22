import { encodeBase64URL } from '@aracna/core'
import { randomBytes } from 'crypto'

export function generateFirebaseFID() {
  let fid: Buffer

  // A valid FID has exactly 22 base64 characters, which is 132 bits, or 16.5
  // bytes. our implementation generates a 17 byte array instead.
  fid = randomBytes(17)

  // Replace the first 4 random bits with the constant FID header of 0b0111.
  fid[0] = 0b01110000 + (fid[0] % 0b00010000)

  return encodeBase64URL(fid, { pad: false })
}
