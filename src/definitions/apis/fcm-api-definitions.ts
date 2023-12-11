import { FetchResponse } from '@aracna/core'

export namespace FCMAPIDefinitions {
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
