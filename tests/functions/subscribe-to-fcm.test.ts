import { ECDH } from 'crypto'
import { describe, expect, it } from 'vitest'
import { FcmSubscription, createFcmECDH, generateFcmAuthSecret, subscribeToFCM } from '../../src'
import { ACG_ID, ACG_SECURITY_TOKEN, APP_ID, ECE_AUTH_SECRET, ECE_PUBLIC_KEY, FCM_SENDER_ID } from '../definitions/constants'

describe('subscribeToFCM', () => {
  it('works', async () => {
    let auth: Uint8Array, ecdh: ECDH, subscription: FcmSubscription | Error

    auth = generateFcmAuthSecret()
    ecdh = createFcmECDH()

    subscription = await subscribeToFCM({
      appID: APP_ID,
      ece: {
        authSecret: auth,
        publicKey: ecdh.getPublicKey()
      },
      senderID: FCM_SENDER_ID
    })
    if (subscription instanceof Error) throw subscription

    expect(subscription.acg.id).toBeTypeOf('bigint')
    expect(subscription.acg.securityToken).toBeTypeOf('bigint')
    expect(subscription.token).toBeTypeOf('string')
  })

  it('works with existing ACG ID and ACG security token', async () => {
    let subscription: FcmSubscription | Error

    subscription = await subscribeToFCM({
      acg: {
        id: ACG_ID,
        securityToken: ACG_SECURITY_TOKEN
      },
      appID: APP_ID,
      ece: {
        authSecret: ECE_AUTH_SECRET,
        publicKey: ECE_PUBLIC_KEY
      },
      senderID: FCM_SENDER_ID
    })
    if (subscription instanceof Error) throw subscription

    expect(subscription.acg.id).toBe(ACG_ID)
    expect(subscription.acg.securityToken).toBe(ACG_SECURITY_TOKEN)
    expect(subscription.token).toBeTypeOf('string')
  })
})
