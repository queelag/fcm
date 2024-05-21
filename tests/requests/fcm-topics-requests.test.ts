import { describe, expect, it } from 'vitest'
import { FcmTopicsApiDefinitions } from '../../src/definitions/apis/fcm-topics-api-definitions'
import { postFcmTopicsBatchAdd, postFcmTopicsBatchRemove } from '../../src/requests/fcm-topics-requests'
import { FCM_TOKEN, FCM_TOKEN_2, GOOGLE_SERVICE_ACCOUNT } from '../definitions/constants'

describe('FCM Topics Requests', () => {
  it('adds single token', async () => {
    let add: FcmTopicsApiDefinitions.BatchAddResponseData | FcmTopicsApiDefinitions.Error

    add = await postFcmTopicsBatchAdd(GOOGLE_SERVICE_ACCOUNT, 'museum', FCM_TOKEN)
    if (add instanceof Error) throw add

    expect(add.results).toHaveLength(1)
  })

  it('adds multiple tokens', async () => {
    let add: FcmTopicsApiDefinitions.BatchAddResponseData | FcmTopicsApiDefinitions.Error

    add = await postFcmTopicsBatchAdd(GOOGLE_SERVICE_ACCOUNT, 'museum', [FCM_TOKEN, FCM_TOKEN_2])
    if (add instanceof Error) throw add

    expect(add.results).toHaveLength(2)
  })

  it('removes single token', async () => {
    let remove: FcmTopicsApiDefinitions.BatchRemoveResponseData | FcmTopicsApiDefinitions.Error

    remove = await postFcmTopicsBatchRemove(GOOGLE_SERVICE_ACCOUNT, 'museum', FCM_TOKEN)
    if (remove instanceof Error) throw remove

    expect(remove.results).toHaveLength(1)
  })

  it('removes multiple tokens', async () => {
    let remove: FcmTopicsApiDefinitions.BatchRemoveResponseData | FcmTopicsApiDefinitions.Error

    remove = await postFcmTopicsBatchRemove(GOOGLE_SERVICE_ACCOUNT, 'museum', [FCM_TOKEN, FCM_TOKEN_2])
    if (remove instanceof Error) throw remove

    expect(remove.results).toHaveLength(2)
  })
})
