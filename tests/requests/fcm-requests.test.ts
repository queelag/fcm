import { FetchError } from '@aracna/core'
import { ECDH } from 'crypto'
import { describe, expect, it } from 'vitest'
import { createFcmECDH, generateFcmAuthSecret } from '../../src'
import { FcmApiDefinitions } from '../../src/definitions/apis/fcm-api-definitions'
import { AcgCheckinResponse } from '../../src/definitions/interfaces'
import { postAcgCheckin, postAcgRegister } from '../../src/requests/acg-requests'
import { postFcmSendV1, postFcmSubscribe } from '../../src/requests/fcm-requests'
import { ACG_TOKEN, ECE_AUTH_SECRET, ECE_PUBLIC_KEY, FCM_SENDER_ID, FCM_TOKEN, GOOGLE_SERVICE_ACCOUNT } from '../definitions/constants'

describe('FCM Requests', () => {
  it.skip('sends a message', async () => {
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

  it('subscribes with fresh ACG token', async () => {
    let auth: Uint8Array,
      ecdh: ECDH,
      checkin: AcgCheckinResponse | FetchError,
      token: string | FetchError,
      subscription: FcmApiDefinitions.SubscribeResponseData | FetchError

    auth = generateFcmAuthSecret()
    ecdh = createFcmECDH()

    checkin = await postAcgCheckin()
    if (checkin instanceof Error) throw checkin

    token = await postAcgRegister(checkin.android_id, checkin.security_token, 'aracna.fcm')
    if (token instanceof Error) throw token

    subscription = await postFcmSubscribe(FCM_SENDER_ID, token, ecdh.getPublicKey(), auth)
    if (subscription instanceof Error) throw subscription

    expect(subscription.token).toBeTypeOf('string')
  })
})
