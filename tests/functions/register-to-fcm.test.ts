import { describe, expect, it } from 'vitest'
import { FcmRegistration, registerToFCM } from '../../src'
import {
  ACG_ID,
  ACG_SECURITY_TOKEN,
  APP_ID,
  ECDH_PUBLIC_KEY,
  ECDH_SALT,
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_PROJECT_ID,
  VAPID_KEY
} from '../definitions/constants'

describe('registerToFCM', () => {
  it('works', async () => {
    let registration: FcmRegistration | Error

    registration = await registerToFCM({
      acg: {
        id: ACG_ID,
        securityToken: ACG_SECURITY_TOKEN
      },
      appID: APP_ID,
      ecdh: {
        publicKey: ECDH_PUBLIC_KEY,
        salt: ECDH_SALT
      },
      firebase: {
        apiKey: FIREBASE_API_KEY,
        appID: FIREBASE_APP_ID,
        projectID: FIREBASE_PROJECT_ID
      },
      vapidKey: VAPID_KEY
    })
    if (registration instanceof Error) throw registration

    console.log(registration)

    expect(registration.acg.id).toBe(ACG_ID)
    expect(registration.acg.securityToken).toBe(ACG_SECURITY_TOKEN)
    expect(registration.token).toBeTypeOf('string')
  })
})
