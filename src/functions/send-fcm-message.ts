import { FcmApiError, FcmApiMessage, GoogleServiceAccount } from '../definitions/interfaces.js'
import { FcmApiMessageWithTarget } from '../definitions/types.js'
import { postFcmSendV1 } from '../requests/fcm-requests.js'

/**
 * Sends a message to Firebase Cloud Messaging using the v1 API. The target can be a condition, a token or a topic.
 *
 * - The token can be obtained with the `registerToFCM` function.
 * - The account is a JSON file that can be downloaded from the Firebase console.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/fcm/functions/send-fcm-message)
 */
export async function sendFcmMessage<T extends object>(
  account: GoogleServiceAccount,
  message: FcmApiMessageWithTarget<T>,
  validateOnly?: boolean
): Promise<FcmApiMessage<T> | FcmApiError> {
  return postFcmSendV1(account, message, validateOnly)
}
