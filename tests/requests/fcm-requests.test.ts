import { FetchError, generateRandomString } from '@aracna/core'
import { ECDH } from 'crypto'
import { beforeAll, describe, expect, it } from 'vitest'
import { createFCMPrime256v1ECDH, generateFCMSalt } from '../../src'
import { FCMAPIDefinitions } from '../../src/definitions/apis/fcm-api-definitions'
import { postFCMSubscribe } from '../../src/requests/fcm-requests'

describe('FCM Requests', () => {
  let token: string

  beforeAll(() => {
    token =
      'f1p1CIZsW7U:APA91bEKI_wOi9pSqOHeD2s-F0CMgNVSaegfsI06WASAjFZVOazOCg3p3YnkoezG3zJ2USN--IN9gRdZtyA91JZqOKdaX9i03QAtwkBZOmlj7LKGM8-cy51QxT4x1_4fpzwI4uWsrgPo'
  })

  it('subscribes', async () => {
    let senderID: string, ecdh: ECDH, salt: Uint8Array, subscription: FCMAPIDefinitions.SubscribeResponseData | FetchError

    senderID = generateRandomString()
    ecdh = createFCMPrime256v1ECDH()
    salt = generateFCMSalt()

    subscription = await postFCMSubscribe(senderID, token, ecdh.getPublicKey(), salt)
    if (subscription instanceof Error) throw subscription

    expect(subscription.token).toBeTypeOf('string')
  })
})
