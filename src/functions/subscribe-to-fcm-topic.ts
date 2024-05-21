import { FcmTopicSubscription, GoogleServiceAccountWithoutProjectID } from '../definitions/interfaces.js'
import { postFcmTopicsBatchAdd } from '../requests/fcm-topics-requests.js'

export async function subscribeToFcmTopic(
  account: GoogleServiceAccountWithoutProjectID,
  topic: string,
  ...tokens: string[]
): Promise<FcmTopicSubscription | Error>
export async function subscribeToFcmTopic(account: GoogleServiceAccountWithoutProjectID, topic: string, tokens: string[]): Promise<FcmTopicSubscription | Error>
export async function subscribeToFcmTopic(account: GoogleServiceAccountWithoutProjectID, topic: string, ...args: any[]): Promise<FcmTopicSubscription | Error> {
  return postFcmTopicsBatchAdd(account, topic, ...args)
}
