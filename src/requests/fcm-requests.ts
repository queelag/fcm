import { FetchError, concatURL, encodeBase64URL, serializeURLSearchParams } from '@aracna/core'
import { FCMAPI } from '../apis/fcm-api.js'
import { FCMAPIDefinitions } from '../definitions/apis/fcm-api-definitions.js'

/**
 * @deprecated
 *
 * Will stop working in June 2024.
 */
export async function postFCMSend<T extends object>(serverKey: string, to: string, notification: T): Promise<FCMAPIDefinitions.SendResponseData | FetchError> {
  let body: FCMAPIDefinitions.SendRequestBody, headers: HeadersInit, response: FCMAPIDefinitions.SendResponse | FetchError

  body = {
    notification: notification,
    to: to
  }

  headers = {
    authorization: `key=${serverKey}`
  }

  response = await FCMAPI.post('send', body, { headers })
  if (response instanceof Error) return response

  if (response.data.failure > 0) {
    return FetchError.from(response)
  }

  return response.data
}

/**
 * @deprecated
 *
 * Will stop working in June 2024.
 */
export async function postFCMSubscribe(
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
