import { FetchError } from '@aracna/core'
import { FcmApiDefinitions } from '../definitions/apis/fcm-api-definitions.js'
import { AcgCheckinResponse, FcmSubscription, SubscribeToFcmConfig } from '../definitions/interfaces.js'
import { FunctionLogger } from '../loggers/function-logger.js'
import { postAcgCheckin, postAcgRegister } from '../requests/acg-requests.js'
import { postFcmSubscribe } from '../requests/fcm-requests.js'

/**
 * @deprecated
 *
 * Will stop working in June 2024.
 */
export async function subscribeToFCM(config: SubscribeToFcmConfig): Promise<FcmSubscription | Error> {
  let checkin: AcgCheckinResponse | FetchError,
    token: string | FetchError,
    fcm: FcmApiDefinitions.SubscribeResponseData | FetchError,
    subscription: FcmSubscription

  checkin = await postAcgCheckin(config.acg?.id, config.acg?.securityToken)
  if (checkin instanceof Error) return checkin

  token = await postAcgRegister(checkin.android_id, checkin.security_token, config.appID)
  if (token instanceof Error) return token

  fcm = await postFcmSubscribe(config.senderID, token, config.ecdh.publicKey, config.ecdh.salt)
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
