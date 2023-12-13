import { decodeBase64, decodeText } from '@aracna/core'
import { describe, expect, it } from 'vitest'
import { sendFcmMessage } from '../../src'
import { FcmApiDefinitions } from '../../src/definitions/apis/fcm-api-definitions'

describe('Send FCM Message', () => {
  it('sends', async () => {
    let message: FcmApiDefinitions.V1.MessageWithTarget, sent: FcmApiDefinitions.V1.Message | FcmApiDefinitions.V1.Error

    message = {
      token: import.meta.env.VITE_FCM_TOKEN
    }

    sent = await sendFcmMessage(
      import.meta.env.VITE_FIREBASE_PROJECT_ID,
      JSON.parse(decodeText(decodeBase64(import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT))),
      message
    )
    if (sent instanceof Error) throw sent

    expect(sent.name).toBeTypeOf('string')
  })
})
