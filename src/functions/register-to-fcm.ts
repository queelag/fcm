import { FetchError } from '@aracna/core'
import { FCMRegistrationsAPIDefinitions } from '../definitions/apis/fcm-registrations-api-definitions.js'
import { FirebaseInstallationsAPIDefinitions } from '../definitions/apis/firebase-installations-api-definitions.js'
import { ACGCheckinResponse, FCMRegistration, RegisterToFCMConfig } from '../definitions/interfaces.js'
import { postACGCheckin, postACGRegister } from '../requests/acg-requests.js'
import { postFCMRegistrations } from '../requests/fcm-registrations-requests.js'
import { postFirebaseInstallations } from '../requests/firebase-installations-requests.js'

export async function registerToFCM(config: RegisterToFCMConfig): Promise<FCMRegistration | Error> {
  let checkin: ACGCheckinResponse | FetchError,
    token: string | FetchError,
    installation: FirebaseInstallationsAPIDefinitions.InstallationsResponseData | FetchError,
    registration: FCMRegistrationsAPIDefinitions.RegistrationsResponseData | FetchError,
    result: FCMRegistration

  checkin = await postACGCheckin(config.acg?.id, config.acg?.securityToken)
  if (checkin instanceof Error) return checkin

  token = await postACGRegister(checkin.android_id, checkin.security_token, config.appID)
  if (token instanceof Error) return token

  installation = await postFirebaseInstallations(config.firebase.appID, config.firebase.projectID, config.firebase.apiKey)
  if (installation instanceof Error) return installation

  registration = await postFCMRegistrations(
    config.firebase.projectID,
    config.firebase.apiKey,
    config.vapidKey,
    config.ecdh.salt,
    installation.authToken.token,
    config.ecdh.publicKey,
    token
  )
  if (registration instanceof Error) return registration

  result = {
    acg: {
      id: checkin.android_id,
      securityToken: checkin.security_token
    },
    token: registration.token
  }

  return result
}
