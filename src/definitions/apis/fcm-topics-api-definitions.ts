import { FetchError, FetchResponse } from '@aracna/core'

export namespace FcmTopicsApiDefinitions {
  export interface BatchAddRequestBody {
    registration_tokens: string[]
    to: string
  }

  export interface BatchAddResponseData {
    results: object[]
  }

  export interface BatchAddResponse extends FetchResponse<BatchAddResponseData> {}

  export interface BatchRemoveRequestBody extends BatchAddRequestBody {}

  export interface BatchRemoveResponseData extends BatchAddResponseData {}

  export interface BatchRemoveResponse extends FetchResponse<BatchRemoveResponseData> {}

  export interface ErrorData {
    error: string
  }

  export interface Error extends FetchError<ErrorData> {}
}
