import { FetchError } from '@aracna/core'
import { describe, expect, it } from 'vitest'
import { FirebaseInstallationsApiDefinitions } from '../../src/definitions/apis/firebase-installations-api-definitions'
import { postFirebaseInstallations } from '../../src/requests/firebase-installations-requests'

describe('Firebase Installations Requests', () => {
  it('installs', async () => {
    let installation: FirebaseInstallationsApiDefinitions.InstallationsResponseData | FetchError

    installation = await postFirebaseInstallations(
      import.meta.env.VITE_FIREBASE_APP_ID,
      import.meta.env.VITE_FIREBASE_PROJECT_ID,
      import.meta.env.VITE_FIREBASE_API_KEY
    )
    if (installation instanceof Error) throw installation

    expect(installation.authToken.token).toBeTypeOf('string')
  })
})
