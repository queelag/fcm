import { FetchError, concatURL, encodeBase64URL } from '@aracna/core'
import { FcmAPI } from '../apis/fcm-api.js'
import { FcmRegistrationsAPI } from '../apis/fcm-registrations-api.js'
import { FcmRegistrationsApiDefinitions } from '../definitions/apis/fcm-registrations-api-definitions.js'
import { DEFAULT_VAPID_KEY } from '../definitions/constants.js'

export async function postFcmRegistrations(
  projectID: string,
  apiKey: string,
  auth: ArrayLike<number>,
  firebaseInstallationsAuth: string,
  p256dh: ArrayLike<number>,
  token: string,
  applicationPubKey: string = DEFAULT_VAPID_KEY
): Promise<FcmRegistrationsApiDefinitions.RegistrationsResponseData | FetchError> {
  let body: FcmRegistrationsApiDefinitions.RegistrationsRequestBody,
    headers: HeadersInit,
    response: FcmRegistrationsApiDefinitions.RegistrationsResponse | FetchError

  body = {
    web: {
      applicationPubKey,
      auth: encodeBase64URL(auth, { pad: false }),
      endpoint: concatURL(FcmAPI.getBaseURL(), `fcm/send/${token}`),
      p256dh: encodeBase64URL(p256dh, { pad: false })
    }
  }

  headers = {
    accept: 'application/json',
    'content-type': 'application/json',
    'x-goog-api-key': apiKey,
    'x-goog-firebase-installations-auth': `FIS ${firebaseInstallationsAuth}`
  }

  response = await FcmRegistrationsAPI.post(`projects/${projectID}/registrations`, body, { headers })
  if (response instanceof Error) return response

  return response.data
}
