import { FetchError } from '@aracna/core'
import { describe, expect, it } from 'vitest'
import { FirebaseInstallationsApiDefinitions } from '../../src/definitions/apis/firebase-installations-api-definitions'
import { postFirebaseInstallations } from '../../src/requests/firebase-installations-requests'
import { FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_PROJECT_ID } from '../definitions/constants'

describe('Firebase Installations Requests', () => {
  it('installs', async () => {
    let installation: FirebaseInstallationsApiDefinitions.InstallationsResponseData | FetchError

    installation = await postFirebaseInstallations(FIREBASE_APP_ID, FIREBASE_PROJECT_ID, FIREBASE_API_KEY)
    if (installation instanceof Error) throw installation

    expect(installation.authToken.token).toBeTypeOf('string')
  })
})
