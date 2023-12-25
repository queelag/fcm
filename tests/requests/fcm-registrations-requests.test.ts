import { FetchError } from '@aracna/core'
import { describe, expect, it } from 'vitest'
import { FcmRegistrationsApiDefinitions } from '../../src/definitions/apis/fcm-registrations-api-definitions'
import { FirebaseInstallationsApiDefinitions } from '../../src/definitions/apis/firebase-installations-api-definitions'
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
      VAPID_KEY,
      ECE_AUTH_SECRET,
      installation.authToken.token,
      ECE_PUBLIC_KEY,
      ACG_TOKEN
    )
    if (registration instanceof Error) throw registration

    expect(registration.token).toBeTypeOf('string')
  })
})
