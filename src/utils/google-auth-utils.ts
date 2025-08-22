import { Credentials, JWT } from 'google-auth-library'
import { GOOGLE_AUTH_JWT_SCOPES } from '../definitions/constants.js'

export async function getGoogleAuthAccessToken(email: string, key: string): Promise<string | undefined> {
  let jwt: JWT, credentials: Credentials

  jwt = new JWT({ email, key, scopes: GOOGLE_AUTH_JWT_SCOPES })
  credentials = await jwt.authorize()

  return credentials.access_token ?? undefined
}
