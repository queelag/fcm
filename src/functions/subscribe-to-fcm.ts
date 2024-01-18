import { FetchError } from '@aracna/core'
import { FcmApiDefinitions } from '../definitions/apis/fcm-api-definitions.js'
import { AcgCheckinResponse, FcmSubscription, SubscribeToFcmConfig, SubscribeToFcmOptions } from '../definitions/interfaces.js'
import { FunctionLogger } from '../loggers/function-logger.js'
import { postAcgCheckin, postAcgRegister } from '../requests/acg-requests.js'
import { postFcmSubscribe } from '../requests/fcm-requests.js'

/**
 * Subscribes to Firebase Cloud Messaging using a deprecated API.
 * Exists only for retro compatibility reasons, please use the `registerToFCM` function instead.
 *
 * - Optionally registers with already existing ACG ID and ACG security token.
 * - Optionally delays the ACG registration between each retry.
 * - Optionally uses a custom amount of retries for the ACG registration.
 *
 * Configuration:
 *
 * - The app ID is the package name of the app.
 * - The ECE auth secret and ECE public key must be generated beforehand with the `createFcmECDH` and `generateFcmAuthSecret` functions. The auth secret and ECDH keys must be stored.
 * - The sender ID can be found in the Firebase console.
 *
 * Returns the ACG ID, ACG security token and FCM token, which must be stored.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/fcm/functions/subscribe-to-fcm)
 *
 * @deprecated Will stop working in June 2024.
 */
export async function subscribeToFCM(config: SubscribeToFcmConfig, options?: SubscribeToFcmOptions): Promise<FcmSubscription | Error> {
  let checkin: AcgCheckinResponse | FetchError,
    token: string | FetchError,
    fcm: FcmApiDefinitions.SubscribeResponseData | FetchError,
    subscription: FcmSubscription

  checkin = await postAcgCheckin(config.acg?.id, config.acg?.securityToken)
  if (checkin instanceof Error) return checkin

  token = await postAcgRegister(checkin.android_id, checkin.security_token, config.appID, options?.acg?.register)
  if (token instanceof Error) return token

  fcm = await postFcmSubscribe(config.senderID, token, config.ece.publicKey, config.ece.authSecret)
  if (fcm instanceof Error) return fcm

  subscription = {
    acg: {
      id: checkin.android_id,
      securityToken: checkin.security_token
    },
    token: fcm.token
  }
  FunctionLogger.info('subscribeToFCM', `The subscription has been completed.`, subscription)

  return subscription
}
