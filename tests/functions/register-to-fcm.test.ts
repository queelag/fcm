import { describe, expect, it } from 'vitest'
import { FcmRegistration, registerToFcm } from '../../src'
import { ACG_ID, ACG_SECURITY_TOKEN, APP_ID, ECDH_PUBLIC_KEY, ECDH_SALT } from '../definitions/constants'

describe('registerToFcm', () => {
  it('works', async () => {
    let registration: FcmRegistration | Error

    registration = await registerToFcm({
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
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        appID: import.meta.env.VITE_FIREBASE_APP_ID,
        projectID: import.meta.env.VITE_FIREBASE_PROJECT_ID
      },
      vapidKey: import.meta.env.VITE_VAPID_KEY
    })
    if (registration instanceof Error) throw registration

    expect(registration.acg.id).toBe(ACG_ID)
    expect(registration.acg.securityToken).toBe(ACG_SECURITY_TOKEN)
    expect(registration.token).toBeTypeOf('string')
  })
})
