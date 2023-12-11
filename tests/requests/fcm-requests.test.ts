import { FetchError } from '@aracna/core'
import { describe, expect, it } from 'vitest'
import { FCMAPIDefinitions } from '../../src/definitions/apis/fcm-api-definitions'
import { postFCMSend, postFCMSubscribe } from '../../src/requests/fcm-requests'
import { ACG_TOKEN, ECDH_PUBLIC_KEY, ECDH_SALT } from '../definitions/constants'

describe('FCM Requests', () => {
  it('sends', async () => {
    let sent: FCMAPIDefinitions.SendResponseData | FetchError

    sent = await postFCMSend(import.meta.env.VITE_FCM_SERVER_KEY, import.meta.env.VITE_FCM_TOKEN, {})
    if (sent instanceof Error) throw sent

    expect(sent.success).toBe(1)
  })

  it('subscribes', async () => {
    let subscription: FCMAPIDefinitions.SubscribeResponseData | FetchError

    subscription = await postFCMSubscribe(import.meta.env.VITE_FCM_SENDER_ID, ACG_TOKEN, ECDH_PUBLIC_KEY, ECDH_SALT)
    if (subscription instanceof Error) throw subscription

    expect(subscription.token).toBeTypeOf('string')
  })
})
