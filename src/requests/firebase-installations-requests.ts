import { FetchError, encodeBase64URL, encodeText } from '@aracna/core'
import { FirebaseInstallationsAPI } from '../apis/firebase-installations-api.js'
import { FirebaseInstallationsAPIDefinitions } from '../definitions/apis/firebase-installations-api-definitions.js'
import { generateFirebaseFID } from '../utils/firebase-utils.js'

export async function postFirebaseInstallations(
  appID: string,
  projectID: string,
  apiKey: string
): Promise<FirebaseInstallationsAPIDefinitions.InstallationsResponseData | FetchError> {
  let body: FirebaseInstallationsAPIDefinitions.InstallationsRequestBody,
    heartbeat: FirebaseInstallationsAPIDefinitions.Heartbeat,
    headers: HeadersInit,
    response: FirebaseInstallationsAPIDefinitions.InstallationsResponse | FetchError

  body = {
    appId: appID,
    authVersion: 'FIS_v2',
    fid: generateFirebaseFID(),
    sdkVersion: 'w:0.6.4'
  }

  heartbeat = {
    heartbeats: [],
    version: 2
  }

  headers = {
    'x-firebase-client': encodeBase64URL(encodeText(JSON.stringify(heartbeat)), { pad: false }),
    'x-goog-api-key': apiKey
  }

  response = await FirebaseInstallationsAPI.post(`projects/${projectID}/installations`, body, { headers })
  if (response instanceof Error) return response

  return response.data
}
