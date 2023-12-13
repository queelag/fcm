import { FetchError, decodeBase64, decodeText } from '@aracna/core'
import { describe, expect, it } from 'vitest'
import { FcmApiDefinitions } from '../../src/definitions/apis/fcm-api-definitions'
import { postFcmSendV1, postFcmSubscribe } from '../../src/requests/fcm-requests'
import { ACG_TOKEN, ECDH_PUBLIC_KEY, ECDH_SALT } from '../definitions/constants'

describe('FCM Requests', () => {
  it('sends a message', async () => {
    let message: FcmApiDefinitions.V1.MessageWithTarget, sent: FcmApiDefinitions.V1.Message | FcmApiDefinitions.V1.Error

    message = {
      token: import.meta.env.VITE_FCM_TOKEN
    }

    sent = await postFcmSendV1(
      import.meta.env.VITE_FIREBASE_PROJECT_ID,
      JSON.parse(decodeText(decodeBase64(import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT))),
      message
    )
    if (sent instanceof Error) throw sent

    expect(sent.name).toBeTypeOf('string')
  })

  it('subscribes', async () => {
    let subscription: FcmApiDefinitions.SubscribeResponseData | FetchError

    subscription = await postFcmSubscribe(import.meta.env.VITE_FCM_SENDER_ID, ACG_TOKEN, ECDH_PUBLIC_KEY, ECDH_SALT)
    if (subscription instanceof Error) throw subscription

    expect(subscription.token).toBeTypeOf('string')
  })
})
