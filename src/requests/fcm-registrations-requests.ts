import { FetchError, concatURL, encodeBase64URL } from '@aracna/core'
import { FCMAPI } from '../apis/fcm-api.js'
import { FCMRegistrationsAPI } from '../apis/fcm-registrations-api.js'
import { FCMRegistrationsAPIDefinitions } from '../definitions/apis/fcm-registrations-api-definitions.js'

export async function postFCMRegistrations(
  projectID: string,
  apiKey: string,
  applicationPubKey: string,
  auth: ArrayLike<number>,
  firebaseInstallationsAuth: string,
  p256dh: ArrayLike<number>,
  token: string
): Promise<FCMRegistrationsAPIDefinitions.RegistrationsResponseData | FetchError> {
  let body: FCMRegistrationsAPIDefinitions.RegistrationsRequestBody,
    headers: HeadersInit,
    response: FCMRegistrationsAPIDefinitions.RegistrationsResponse | FetchError

  body = {
    web: {
      applicationPubKey,
      auth: encodeBase64URL(auth, { pad: false }),
      endpoint: concatURL(FCMAPI.baseURL, 'send', token),
      p256dh: encodeBase64URL(p256dh, { pad: false })
    }
  }

  headers = {
    'X-Goog-Api-Key': apiKey,
    'X-Goog-Firebase-Installations-Auth': firebaseInstallationsAuth
  }

  response = await FCMRegistrationsAPI.post(`projects/${projectID}/registrations`, body, { headers })
  if (response instanceof Error) return response

  return response.data
}
