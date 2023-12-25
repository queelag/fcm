import { FetchError } from '@aracna/core'
import { describe, expect, it } from 'vitest'
import { FcmApiDefinitions } from '../../src/definitions/apis/fcm-api-definitions'
import { postFcmSendV1, postFcmSubscribe } from '../../src/requests/fcm-requests'
import { ACG_TOKEN, ECE_AUTH_SECRET, ECE_PUBLIC_KEY, FCM_SENDER_ID, FCM_TOKEN, GOOGLE_SERVICE_ACCOUNT } from '../definitions/constants'

describe('FCM Requests', () => {
  it('sends a message', async () => {
    let message: FcmApiDefinitions.V1.MessageWithTarget, sent: FcmApiDefinitions.V1.Message | FcmApiDefinitions.V1.Error

    message = {
      token: FCM_TOKEN
    }

    sent = await postFcmSendV1(GOOGLE_SERVICE_ACCOUNT, message)
    if (sent instanceof Error) throw sent

    expect(sent.name).toBeTypeOf('string')
  })

  it('subscribes', async () => {
    let subscription: FcmApiDefinitions.SubscribeResponseData | FetchError

    subscription = await postFcmSubscribe(FCM_SENDER_ID, ACG_TOKEN, ECE_PUBLIC_KEY, ECE_AUTH_SECRET)
    if (subscription instanceof Error) throw subscription

    expect(subscription.token).toBeTypeOf('string')
  })
})
