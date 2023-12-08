import { FetchError } from '@aracna/core'
import { FCMAPIDefinitions } from '../definitions/fcm-api-definitions.js'
import { FCMSubscription } from '../definitions/interfaces.js'
import { AndroidCheckinResponse, FCMSubscribeRequest } from '../index.js'
import { ACGCheckinRequest, ACGRegisterRequest } from '../requests/acg-requests.js'

export async function subscribeToFCM(
  appID: string,
  senderID: string,
  key: ArrayLike<number>,
  auth: ArrayLike<number>,
  acgID?: bigint,
  acgSecurityToken?: bigint
): Promise<FCMSubscription | Error> {
  let checkin: AndroidCheckinResponse | FetchError,
    token: string | FetchError,
    fcm: FCMAPIDefinitions.SubscribeResponseData | FetchError,
    subscription: FCMSubscription

  checkin = await ACGCheckinRequest(acgID, acgSecurityToken)
  if (checkin instanceof Error) return checkin

  token = await ACGRegisterRequest(appID, checkin.androidId, checkin.securityToken)
  if (token instanceof Error) return token

  fcm = await FCMSubscribeRequest(senderID, token, key, auth)
  if (fcm instanceof Error) return fcm

  subscription = {
    acg: {
      id: checkin.androidId,
      securityToken: checkin.securityToken
    },
    token: fcm.token
  }

  return subscription
}
