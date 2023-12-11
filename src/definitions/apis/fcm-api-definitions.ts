import { FetchResponse } from '@aracna/core'

export namespace FCMAPIDefinitions {
  export interface SendRequestBody<T extends object = object> {
    notification: T
    to: string
  }

  export interface SendResponse extends FetchResponse<SendResponseData> {}

  export interface SendResponseData {
    canonical_ids: number
    failure: number
    multicast_id: number
    results: unknown[]
    success: number
  }

  export interface SubscribeRequestBody {
    authorized_entity: string
    encryption_auth: string
    encryption_key: string
    endpoint: string
  }

  export interface SubscribeResponse extends FetchResponse<SubscribeResponseData> {}

  export interface SubscribeResponseData {
    pushSet: string
    token: string
  }
}
