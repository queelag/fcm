import { FetchError } from '@aracna/core'
import { FirebaseInstallationsAPI } from '../apis/firebase-installations-api.js'
import { FirebaseInstallationsApiDefinitions } from '../definitions/apis/firebase-installations-api-definitions.js'
import { generateFirebaseFID } from '../utils/firebase-utils.js'

export async function postFirebaseInstallations(
  appID: string,
  projectID: string,
  apiKey: string
): Promise<FirebaseInstallationsApiDefinitions.InstallationsResponseData | FetchError> {
  let body: FirebaseInstallationsApiDefinitions.InstallationsRequestBody,
    headers: HeadersInit,
    response: FirebaseInstallationsApiDefinitions.InstallationsResponse | FetchError

  body = {
    appId: appID,
    authVersion: 'FIS_v2',
    fid: generateFirebaseFID(),
    sdkVersion: 'w:0.6.13'
  }

  headers = {
    accept: 'application/json',
    'content-type': 'application/json',
    'x-goog-api-key': apiKey
  }

  response = await FirebaseInstallationsAPI.post(`projects/${projectID}/installations`, body, { headers })
  if (response instanceof Error) return response

  return response.data
}
