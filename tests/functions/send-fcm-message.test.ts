import { ECDH } from 'crypto'
import { describe, expect, it } from 'vitest'
import { FcmRegistration, createFcmECDH, generateFcmAuthSecret, registerToFCM, sendFcmMessage } from '../../src'
import { FcmApiDefinitions } from '../../src/definitions/apis/fcm-api-definitions'
import { APP_ID, FCM_TOKEN, FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_PROJECT_ID, GOOGLE_SERVICE_ACCOUNT, VAPID_KEY } from '../definitions/constants'

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

  it('sends with fresh token', async () => {
    let auth: Uint8Array,
      ecdh: ECDH,
      registration: FcmRegistration | Error,
      message: FcmApiDefinitions.V1.MessageWithTarget,
      sent: FcmApiDefinitions.V1.Message | FcmApiDefinitions.V1.Error

    auth = generateFcmAuthSecret()
    ecdh = createFcmECDH()

    registration = await registerToFCM({
      appID: APP_ID,
      ece: {
        authSecret: auth,
        publicKey: ecdh.getPublicKey()
      },
      firebase: {
        apiKey: FIREBASE_API_KEY,
        appID: FIREBASE_APP_ID,
        projectID: FIREBASE_PROJECT_ID
      },
      vapidKey: VAPID_KEY
    })
    if (registration instanceof Error) throw registration

    message = {
      token: registration.token
    }

    sent = await sendFcmMessage(GOOGLE_SERVICE_ACCOUNT, message)
    if (sent instanceof Error) throw sent

    expect(sent.name).toBeTypeOf('string')
  })
})
