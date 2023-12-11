import { FetchError } from '@aracna/core'
import { describe, expect, it } from 'vitest'
import { FCMRegistrationsAPIDefinitions } from '../../src/definitions/apis/fcm-registrations-api-definitions'
import { FirebaseInstallationsAPIDefinitions } from '../../src/definitions/apis/firebase-installations-api-definitions'
import { postFCMRegistrations } from '../../src/requests/fcm-registrations-requests'
import { postFirebaseInstallations } from '../../src/requests/firebase-installations-requests'
import { ACG_TOKEN, ECDH_PUBLIC_KEY, ECDH_SALT } from '../definitions/constants'

describe('FCM Registrations Requests', () => {
  it('registers', async () => {
    let installation: FirebaseInstallationsAPIDefinitions.InstallationsResponseData | FetchError,
      registration: FCMRegistrationsAPIDefinitions.RegistrationsResponseData | FetchError

    installation = await postFirebaseInstallations(
      import.meta.env.VITE_FIREBASE_APP_ID,
      import.meta.env.VITE_FIREBASE_PROJECT_ID,
      import.meta.env.VITE_FIREBASE_API_KEY
    )
    if (installation instanceof Error) throw installation

    registration = await postFCMRegistrations(
      import.meta.env.VITE_FIREBASE_PROJECT_ID,
      import.meta.env.VITE_FIREBASE_API_KEY,
      import.meta.env.VITE_VAPID_KEY,
      ECDH_SALT,
      installation.authToken.token,
      ECDH_PUBLIC_KEY,
      ACG_TOKEN
    )
    if (registration instanceof Error) throw registration

    expect(registration.token).toBeTypeOf('string')
  })
})
