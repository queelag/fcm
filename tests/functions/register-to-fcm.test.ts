import { ECDH } from 'crypto'
import { describe, expect, it } from 'vitest'
import { FcmRegistration, createFcmECDH, generateFcmAuthSecret, registerToFCM } from '../../src'
import {
  ACG_ID,
  ACG_SECURITY_TOKEN,
  APP_ID,
  ECE_AUTH_SECRET,
  ECE_PUBLIC_KEY,
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_PROJECT_ID,
  VAPID_KEY
} from '../definitions/constants'

describe('registerToFCM', () => {
  it('works', async () => {
    let auth: Buffer, ecdh: ECDH, registration: FcmRegistration | Error

    auth = generateFcmAuthSecret()
    ecdh = createFcmECDH()

    registration = await registerToFCM({
      appID: APP_ID,
      ece: {
        authSecret: auth,
        publicKey: ecdh.getPublicKey()
      },
      firebase: {
        apiKey: FIREBASE_API_KEY,
        appID: FIREBASE_APP_ID,
        projectID: FIREBASE_PROJECT_ID
      },
      vapidKey: VAPID_KEY
    })
    if (registration instanceof Error) throw registration

    expect(registration.acg.id).toBeTypeOf('bigint')
    expect(registration.acg.securityToken).toBeTypeOf('bigint')
    expect(registration.token).toBeTypeOf('string')
  })

  it('works with existing ACG ID and ACG security token', async () => {
    let registration: FcmRegistration | Error

    registration = await registerToFCM({
      acg: {
        id: ACG_ID,
        securityToken: ACG_SECURITY_TOKEN
      },
      appID: APP_ID,
      ece: {
        authSecret: ECE_AUTH_SECRET,
        publicKey: ECE_PUBLIC_KEY
      },
      firebase: {
        apiKey: FIREBASE_API_KEY,
        appID: FIREBASE_APP_ID,
        projectID: FIREBASE_PROJECT_ID
      },
      vapidKey: VAPID_KEY
    })
    if (registration instanceof Error) throw registration

    expect(registration.acg.id).toBe(ACG_ID)
    expect(registration.acg.securityToken).toBe(ACG_SECURITY_TOKEN)
    expect(registration.token).toBeTypeOf('string')
  })
})
