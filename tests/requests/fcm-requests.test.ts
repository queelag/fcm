import { describe, expect, it } from 'vitest'
import { FcmApiDefinitions } from '../../src/definitions/apis/fcm-api-definitions'
import { postFcmSendV1 } from '../../src/requests/fcm-requests'
import { FCM_TOKEN, GOOGLE_SERVICE_ACCOUNT } from '../definitions/constants'

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
})
