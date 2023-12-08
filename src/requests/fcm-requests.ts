import { FetchError, concatURL, encodeBase64URL, serializeURLSearchParams } from '@aracna/core'
import { FCMAPI } from '../apis/fcm-api.js'
import { FCMAPIDefinitions } from '../definitions/fcm-api-definitions.js'

export async function FCMSubscribeRequest(
  senderID: string,
  token: string,
  key: ArrayLike<number>,
  auth: ArrayLike<number>
): Promise<FCMAPIDefinitions.SubscribeResponseData | FetchError> {
  let body: URLSearchParams, response: FCMAPIDefinitions.SubscribeResponse | FetchError

  body = serializeURLSearchParams<FCMAPIDefinitions.SubscribeRequestBody>({
    authorized_entity: senderID,
    encryption_auth: encodeBase64URL(auth, { pad: false }),
    encryption_key: encodeBase64URL(key, { pad: false }),
    endpoint: concatURL(FCMAPI.baseURL, 'send', token)
  })

  response = await FCMAPI.post('connect/subscribe', body)
  if (response instanceof Error) return response

  return response.data
}
