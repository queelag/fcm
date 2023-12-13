import { FetchResponse } from '@aracna/core'

export namespace FcmRegistrationsApiDefinitions {
  export interface RegistrationsRequestBody {
    web: {
      applicationPubKey: string
      auth: string
      endpoint: string
      p256dh: string
    }
  }

  export interface RegistrationsResponseData {
    name: string
    token: string
    web: {
      applicationPubKey: string
      auth: string
      endpoint: string
      p256dh: string
    }
  }

  export interface RegistrationsResponse extends FetchResponse<RegistrationsResponseData> {}
}
