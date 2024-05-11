import { FcmTopicsAPI } from '../apis/fcm-topics-api.js'
import { FcmTopicsApiDefinitions } from '../definitions/apis/fcm-topics-api-definitions.js'
import { GoogleServiceAccountWithoutProjectID } from '../definitions/interfaces.js'
import { getGoogleAuthAccessToken } from '../utils/google-auth-utils.js'

export async function postFcmTopicsBatchAdd(
  account: GoogleServiceAccountWithoutProjectID,
  topic: string,
  ...tokens: string[]
): Promise<FcmTopicsApiDefinitions.BatchAddResponseData | FcmTopicsApiDefinitions.Error>
export async function postFcmTopicsBatchAdd(
  account: GoogleServiceAccountWithoutProjectID,
  topic: string,
  tokens: string[]
): Promise<FcmTopicsApiDefinitions.BatchAddResponseData | FcmTopicsApiDefinitions.Error>
export async function postFcmTopicsBatchAdd(
  account: GoogleServiceAccountWithoutProjectID,
  topic: string,
  ...args: any[]
): Promise<FcmTopicsApiDefinitions.BatchAddResponseData | FcmTopicsApiDefinitions.Error> {
  let body: FcmTopicsApiDefinitions.BatchAddRequestBody,
    headers: HeadersInit,
    response: FcmTopicsApiDefinitions.BatchAddResponse | FcmTopicsApiDefinitions.Error

  body = {
    registration_tokens: args[0] instanceof Array ? args[0] : args,
    to: topic.startsWith('/topics/') ? topic : `/topics/${topic}`
  }

  headers = {
    access_token_auth: 'true',
    authorization: `Bearer ${await getGoogleAuthAccessToken(account.client_email, account.private_key)}`
  }

  response = await FcmTopicsAPI.post('iid/v1:batchAdd', body, { headers })
  if (response instanceof Error) return response

  return response.data
}

export async function postFcmTopicsBatchRemove(
  account: GoogleServiceAccountWithoutProjectID,
  topic: string,
  ...tokens: string[]
): Promise<FcmTopicsApiDefinitions.BatchRemoveResponseData | FcmTopicsApiDefinitions.Error>
export async function postFcmTopicsBatchRemove(
  account: GoogleServiceAccountWithoutProjectID,
  topic: string,
  tokens: string[]
): Promise<FcmTopicsApiDefinitions.BatchRemoveResponseData | FcmTopicsApiDefinitions.Error>
export async function postFcmTopicsBatchRemove(
  account: GoogleServiceAccountWithoutProjectID,
  topic: string,
  ...args: any[]
): Promise<FcmTopicsApiDefinitions.BatchRemoveResponseData | FcmTopicsApiDefinitions.Error> {
  let body: FcmTopicsApiDefinitions.BatchRemoveRequestBody,
    headers: HeadersInit,
    response: FcmTopicsApiDefinitions.BatchRemoveResponse | FcmTopicsApiDefinitions.Error

  body = {
    registration_tokens: args[0] instanceof Array ? args[0] : args,
    to: topic.startsWith('/topics/') ? topic : `/topics/${topic}`
  }

  headers = {
    access_token_auth: 'true',
    authorization: `Bearer ${await getGoogleAuthAccessToken(account.client_email, account.private_key)}`
  }

  response = await FcmTopicsAPI.post('iid/v1:batchRemove', body, { headers })
  if (response instanceof Error) return response

  return response.data
}
