import { FetchError } from '@aracna/core'
import { FCMAPIDefinitions } from '../definitions/apis/fcm-api-definitions.js'
import { ACGCheckinResponse, FCMSubscription, SubscribeToFCMConfig } from '../definitions/interfaces.js'
import { postACGCheckin, postACGRegister } from '../requests/acg-requests.js'
import { postFCMSubscribe } from '../requests/fcm-requests.js'

/**
 * @deprecated
 *
 * Will stop working in June 2024.
 */
export async function subscribeToFCM(config: SubscribeToFCMConfig): Promise<FCMSubscription | Error> {
  let checkin: ACGCheckinResponse | FetchError,
    token: string | FetchError,
    fcm: FCMAPIDefinitions.SubscribeResponseData | FetchError,
    subscription: FCMSubscription

  checkin = await postACGCheckin(config.acg?.id, config.acg?.securityToken)
  if (checkin instanceof Error) return checkin

  token = await postACGRegister(checkin.android_id, checkin.security_token, config.appID)
  if (token instanceof Error) return token

  fcm = await postFCMSubscribe(config.senderID, token, config.ecdh.publicKey, config.ecdh.salt)
  if (fcm instanceof Error) return fcm

  subscription = {
    acg: {
      id: checkin.android_id,
      securityToken: checkin.security_token
    },
    token: fcm.token
  }

  return subscription
}
