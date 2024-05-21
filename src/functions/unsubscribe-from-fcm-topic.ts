import { FcmTopicUnsubscription, GoogleServiceAccountWithoutProjectID } from '../definitions/interfaces.js'
import { postFcmTopicsBatchRemove } from '../requests/fcm-topics-requests.js'

export async function unsubscribeFromFcmTopic(
  account: GoogleServiceAccountWithoutProjectID,
  topic: string,
  ...tokens: string[]
): Promise<FcmTopicUnsubscription | Error>
export async function unsubscribeFromFcmTopic(
  account: GoogleServiceAccountWithoutProjectID,
  topic: string,
  tokens: string[]
): Promise<FcmTopicUnsubscription | Error>
export async function unsubscribeFromFcmTopic(
  account: GoogleServiceAccountWithoutProjectID,
  topic: string,
  ...args: any[]
): Promise<FcmTopicUnsubscription | Error> {
  return postFcmTopicsBatchRemove(account, topic, ...args)
}
