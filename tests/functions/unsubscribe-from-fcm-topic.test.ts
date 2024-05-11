import { describe, expect, it } from 'vitest'
import { unsubscribeFromFcmTopic } from '../../src'
import { FcmTopicUnsubscription } from '../../src/definitions/interfaces'
import { FCM_TOKEN, FCM_TOKEN_2, GOOGLE_SERVICE_ACCOUNT } from '../definitions/constants'

describe('unsubscribeFromFcmTopic', () => {
  it('unsubscribes single token', async () => {
    let unsubscription: FcmTopicUnsubscription | Error

    unsubscription = await unsubscribeFromFcmTopic(GOOGLE_SERVICE_ACCOUNT, 'museum', FCM_TOKEN)
    if (unsubscription instanceof Error) throw unsubscription

    expect(unsubscription.results).toHaveLength(1)
  })

  it('unsubscribes multiple tokens', async () => {
    let unsubscription: FcmTopicUnsubscription | Error

    unsubscription = await unsubscribeFromFcmTopic(GOOGLE_SERVICE_ACCOUNT, 'museum', [FCM_TOKEN, FCM_TOKEN_2])
    if (unsubscription instanceof Error) throw unsubscription

    expect(unsubscription.results).toHaveLength(2)
  })
})
