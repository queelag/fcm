import { FcmApiDefinitions } from './apis/fcm-api-definitions.js'

export type FcmApiMessageWithTarget<T extends object = object> = FcmApiDefinitions.V1.MessageWithTarget<T>
export type FcmApiNotification<T extends object = object> = FcmApiDefinitions.V1.Notification<T>
