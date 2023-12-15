import { FetchError } from '@aracna/core'
import { FcmRegistrationsApiDefinitions } from '../definitions/apis/fcm-registrations-api-definitions.js'
import { FirebaseInstallationsApiDefinitions } from '../definitions/apis/firebase-installations-api-definitions.js'
import { AcgCheckinResponse, FcmRegistration, RegisterToFcmConfig } from '../definitions/interfaces.js'
import { FunctionLogger } from '../loggers/function-logger.js'
import { postAcgCheckin, postAcgRegister } from '../requests/acg-requests.js'
import { postFcmRegistrations } from '../requests/fcm-registrations-requests.js'
import { postFirebaseInstallations } from '../requests/firebase-installations-requests.js'

export async function registerToFCM(config: RegisterToFcmConfig): Promise<FcmRegistration | Error> {
  let checkin: AcgCheckinResponse | FetchError,
    token: string | FetchError,
    installation: FirebaseInstallationsApiDefinitions.InstallationsResponseData | FetchError,
    registration: FcmRegistrationsApiDefinitions.RegistrationsResponseData | FetchError,
    result: FcmRegistration

  checkin = await postAcgCheckin(config.acg?.id, config.acg?.securityToken)
  if (checkin instanceof Error) return checkin

  token = await postAcgRegister(checkin.android_id, checkin.security_token, config.appID)
  if (token instanceof Error) return token

  installation = await postFirebaseInstallations(config.firebase.appID, config.firebase.projectID, config.firebase.apiKey)
  if (installation instanceof Error) return installation

  registration = await postFcmRegistrations(
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
  FunctionLogger.info('registerToFCM', `The registration has been completed.`, result)

  return result
}
