import { FetchError } from '@aracna/core'
import { FcmRegistrationsApiDefinitions } from '../definitions/apis/fcm-registrations-api-definitions.js'
import { FirebaseInstallationsApiDefinitions } from '../definitions/apis/firebase-installations-api-definitions.js'
import { AcgCheckinResponse, FcmRegistration, RegisterToFcmConfig, RegisterToFcmOptions } from '../definitions/interfaces.js'
import { FunctionLogger } from '../loggers/function-logger.js'
import { postAcgCheckin, postAcgRegister } from '../requests/acg-requests.js'
import { postFcmRegistrations } from '../requests/fcm-registrations-requests.js'
import { postFirebaseInstallations } from '../requests/firebase-installations-requests.js'

/**
 * Registers a device to Firebase Cloud Messaging.
 *
 * - Optionally registers with already existing ACG ID and ACG security token.
 * - Optionally delays the ACG registration between each retry.
 * - Optionally uses a custom amount of retries for the ACG registration.
 *
 * Configuration:
 *
 * - The app ID is the package name of the app.
 * - The ECE auth secret and ECE public key must be generated beforehand with the `createFcmECDH` and `generateFcmAuthSecret` functions. The auth secret and ECDH keys must be stored.
 * - The Firebase API key, Firebase app ID and Firebase project ID can be found in the Firebase console.
 * - The VAPID key can be found in the Firebase console.
 *
 * Returns the ACG ID, ACG security token and FCM token, which must be stored.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/fcm/functions/register-to-fcm)
 */
export async function registerToFCM(config: RegisterToFcmConfig, options?: RegisterToFcmOptions): Promise<FcmRegistration | Error> {
  let checkin: AcgCheckinResponse | FetchError,
    token: string | FetchError,
    installation: FirebaseInstallationsApiDefinitions.InstallationsResponseData | FetchError,
    registration: FcmRegistrationsApiDefinitions.RegistrationsResponseData | FetchError,
    result: FcmRegistration

  checkin = await postAcgCheckin(config.acg?.id, config.acg?.securityToken)
  if (checkin instanceof Error) return checkin

  token = await postAcgRegister(checkin.android_id, checkin.security_token, config.appID, options?.acg?.register)
  if (token instanceof Error) return token

  installation = await postFirebaseInstallations(config.firebase.appID, config.firebase.projectID, config.firebase.apiKey)
  if (installation instanceof Error) return installation

  registration = await postFcmRegistrations(
    config.firebase.projectID,
    config.firebase.apiKey,
    config.ece.authSecret,
    installation.authToken.token,
    config.ece.publicKey,
    token,
    config.vapidKey
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
