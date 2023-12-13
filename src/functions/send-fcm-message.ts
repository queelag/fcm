import { FcmApiError, FcmApiMessage, GoogleServiceAccount } from '../definitions/interfaces.js'
import { FcmApiMessageWithTarget } from '../definitions/types.js'
import { postFcmSendV1 } from '../requests/fcm-requests.js'

/**
 * Send a message to specified target (a registration token, topic or condition).
 */
export async function sendFcmMessage<T extends object>(
  projectID: string,
  serviceAccount: GoogleServiceAccount,
  message: FcmApiMessageWithTarget<T>,
  validateOnly?: boolean
): Promise<FcmApiMessage<T> | FcmApiError> {
  return postFcmSendV1(projectID, serviceAccount, message, validateOnly)
}
