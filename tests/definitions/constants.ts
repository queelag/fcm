import { decodeBase64, decodeText } from '@aracna/core'
import { GoogleServiceAccount } from '../../src'

export const ACG_ID: bigint = BigInt(import.meta.env.VITE_ACG_ID)
export const ACG_SECURITY_TOKEN: bigint = BigInt(import.meta.env.VITE_ACG_SECURITY_TOKEN)
export const ACG_TOKEN: string = import.meta.env.VITE_ACG_TOKEN

export const APP_ID: string = 'aracna.fcm.test'

export const ECE_AUTH_SECRET: Uint8Array = decodeBase64('PZChiwbgqaQ3cWT8vvqwMA==')
export const ECE_PRIVATE_KEY: Uint8Array = decodeBase64('jldkYXifY0biPzg0KC5R5jc/Wvh7i83sBDH/qpf0l74=')
export const ECE_PUBLIC_KEY: Uint8Array = decodeBase64('BD4QIR+mIsck16PMkbQmcfDo9J6/wwzwpeoirJ27U3EzKnW/aANwkpBPTZdkJS+y8r85vQ1zuhti+wTzdyW6f/s=')

export const FCM_SENDER_ID: string = import.meta.env.VITE_FCM_SENDER_ID
export const FCM_SERVER_KEY: string = import.meta.env.VITE_FCM_SERVER_KEY
export const FCM_TOKEN: string = import.meta.env.VITE_FCM_TOKEN

export const FIREBASE_API_KEY: string = import.meta.env.VITE_FIREBASE_API_KEY
export const FIREBASE_APP_ID: string = import.meta.env.VITE_FIREBASE_APP_ID
export const FIREBASE_PROJECT_ID: string = import.meta.env.VITE_FIREBASE_PROJECT_ID

export const GOOGLE_SERVICE_ACCOUNT: GoogleServiceAccount = JSON.parse(decodeText(decodeBase64(import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT)))

export const VAPID_KEY: string = import.meta.env.VITE_VAPID_KEY
