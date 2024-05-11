import { describe, expect, it } from 'vitest'
import { subscribeToFcmTopic } from '../../src'
import { FcmTopicSubscription } from '../../src/definitions/interfaces'
import { FCM_TOKEN, FCM_TOKEN_2, GOOGLE_SERVICE_ACCOUNT } from '../definitions/constants'

describe('subscribeToFcmTopic', () => {
  it('subscribes single token', async () => {
    let subscription: FcmTopicSubscription | Error

    subscription = await subscribeToFcmTopic(GOOGLE_SERVICE_ACCOUNT, 'museum', FCM_TOKEN)
    if (subscription instanceof Error) throw subscription

    expect(subscription.results).toHaveLength(1)
  })

  it('subscribes multiple tokens', async () => {
    let subscription: FcmTopicSubscription | Error

    subscription = await subscribeToFcmTopic(GOOGLE_SERVICE_ACCOUNT, 'museum', [FCM_TOKEN, FCM_TOKEN_2])
    if (subscription instanceof Error) throw subscription

    expect(subscription.results).toHaveLength(2)
  })
})
