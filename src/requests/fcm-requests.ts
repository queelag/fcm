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
