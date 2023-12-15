import { describe, expect, it } from 'vitest'
import { FcmSubscription, subscribeToFCM } from '../../src'
import { ACG_ID, ACG_SECURITY_TOKEN, APP_ID, ECDH_PUBLIC_KEY, ECDH_SALT, FCM_SENDER_ID } from '../definitions/constants'

describe('subscribeToFCM', () => {
  it('works', async () => {
    let subscription: FcmSubscription | Error

    subscription = await subscribeToFCM({
      acg: {
        id: ACG_ID,
        securityToken: ACG_SECURITY_TOKEN
      },
      appID: APP_ID,
      ecdh: {
        publicKey: ECDH_PUBLIC_KEY,
        salt: ECDH_SALT
      },
      senderID: FCM_SENDER_ID
    })
    if (subscription instanceof Error) throw subscription

    expect(subscription.acg.id).toBe(ACG_ID)
    expect(subscription.acg.securityToken).toBe(ACG_SECURITY_TOKEN)
    expect(subscription.token).toBeTypeOf('string')
  })
})
