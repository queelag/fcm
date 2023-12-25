import { describe, expect, it } from 'vitest'
import { sendFcmMessage } from '../../src'
import { FcmApiDefinitions } from '../../src/definitions/apis/fcm-api-definitions'
import { FCM_TOKEN, GOOGLE_SERVICE_ACCOUNT } from '../definitions/constants'

describe('Send FCM Message', () => {
  it('sends', async () => {
    let message: FcmApiDefinitions.V1.MessageWithTarget, sent: FcmApiDefinitions.V1.Message | FcmApiDefinitions.V1.Error

    message = {
      token: FCM_TOKEN
    }

    sent = await sendFcmMessage(GOOGLE_SERVICE_ACCOUNT, message)
    if (sent instanceof Error) throw sent

    expect(sent.name).toBeTypeOf('string')
  })
})
