import { FetchError } from '@aracna/core'
import { ECDH } from 'crypto'
import { describe, expect, it } from 'vitest'
import { createFcmECDH, generateFcmAuthSecret } from '../../src'
import { FcmRegistrationsApiDefinitions } from '../../src/definitions/apis/fcm-registrations-api-definitions'
import { FirebaseInstallationsApiDefinitions } from '../../src/definitions/apis/firebase-installations-api-definitions'
import { AcgCheckinResponse } from '../../src/definitions/interfaces'
import { postAcgCheckin, postAcgRegister } from '../../src/requests/acg-requests'
import { postFcmRegistrations } from '../../src/requests/fcm-registrations-requests'
import { postFirebaseInstallations } from '../../src/requests/firebase-installations-requests'
import { ACG_TOKEN, ECE_AUTH_SECRET, ECE_PUBLIC_KEY, FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_PROJECT_ID, VAPID_KEY } from '../definitions/constants'

describe('FCM Registrations Requests', () => {
  it('registers', async () => {
    let installation: FirebaseInstallationsApiDefinitions.InstallationsResponseData | FetchError,
      registration: FcmRegistrationsApiDefinitions.RegistrationsResponseData | FetchError

    installation = await postFirebaseInstallations(FIREBASE_APP_ID, FIREBASE_PROJECT_ID, FIREBASE_API_KEY)
    if (installation instanceof Error) throw installation

    registration = await postFcmRegistrations(
      FIREBASE_PROJECT_ID,
      FIREBASE_API_KEY,
      ECE_AUTH_SECRET,
      installation.authToken.token,
      ECE_PUBLIC_KEY,
      ACG_TOKEN,
      VAPID_KEY
    )
    if (registration instanceof Error) throw registration

    expect(registration.token).toBeTypeOf('string')
  })

  it('registers with fresh ACG token', async () => {
    let auth: Uint8Array,
      ecdh: ECDH,
      checkin: AcgCheckinResponse | FetchError,
      token: string | FetchError,
      installation: FirebaseInstallationsApiDefinitions.InstallationsResponseData | FetchError,
      registration: FcmRegistrationsApiDefinitions.RegistrationsResponseData | FetchError

    auth = generateFcmAuthSecret()
    ecdh = createFcmECDH()

    checkin = await postAcgCheckin()
    if (checkin instanceof Error) throw checkin

    token = await postAcgRegister(checkin.android_id, checkin.security_token, 'aracna.fcm')
    if (token instanceof Error) throw token

    installation = await postFirebaseInstallations(FIREBASE_APP_ID, FIREBASE_PROJECT_ID, FIREBASE_API_KEY)
    if (installation instanceof Error) throw installation

    registration = await postFcmRegistrations(FIREBASE_PROJECT_ID, FIREBASE_API_KEY, auth, installation.authToken.token, ecdh.getPublicKey(), token, VAPID_KEY)
    if (registration instanceof Error) throw registration

    expect(registration.token).toBeTypeOf('string')
  })
})
