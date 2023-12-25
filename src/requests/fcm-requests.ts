import { FetchError, concatURL, encodeBase64URL, serializeURLSearchParams } from '@aracna/core'
import { FcmAPI } from '../apis/fcm-api.js'
import { FcmApiDefinitions } from '../definitions/apis/fcm-api-definitions.js'
import { GoogleServiceAccount } from '../definitions/interfaces.js'
import { getGoogleAuthAccessToken } from '../utils/google-auth-utils.js'

/**
 * Send a message to specified target (a registration token, topic or condition).
 */
export async function postFcmSendV1<T extends object>(
  account: GoogleServiceAccount,
  message: FcmApiDefinitions.V1.MessageWithTarget<T>,
  validateOnly?: boolean
): Promise<FcmApiDefinitions.V1.Message<T> | FcmApiDefinitions.V1.Error> {
  let body: FcmApiDefinitions.V1.SendRequestBody<T>, headers: HeadersInit, response: FcmApiDefinitions.V1.SendResponse<T> | FcmApiDefinitions.V1.Error

  body = {
    message,
    validate_only: validateOnly
  }

  headers = {
    authorization: `Bearer ${await getGoogleAuthAccessToken(account.client_email, account.private_key)}`
  }

  response = await FcmAPI.post(`v1/projects/${account.project_id}/messages:send`, body, { headers })
  if (response instanceof Error) return response

  return response.data
}

/**
 * @deprecated
 *
 * Will stop working in June 2024.
 */
export async function postFcmSubscribe(
  senderID: string,
  token: string,
  key: ArrayLike<number>,
  auth: ArrayLike<number>
): Promise<FcmApiDefinitions.SubscribeResponseData | FetchError> {
  let body: URLSearchParams, response: FcmApiDefinitions.SubscribeResponse | FetchError

  body = serializeURLSearchParams<FcmApiDefinitions.SubscribeRequestBody>({
    authorized_entity: senderID,
    encryption_auth: encodeBase64URL(auth, { pad: false }),
    encryption_key: encodeBase64URL(key, { pad: false }),
    endpoint: concatURL(FcmAPI.baseURL, 'fcm/send/', token)
  })

  response = await FcmAPI.post('fcm/connect/subscribe', body)
  if (response instanceof Error) return response

  return response.data
}
