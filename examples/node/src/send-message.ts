import { decodeBase64, decodeText } from '@aracna/core'
import { sendFcmMessage } from '@aracna/fcm'
import { DiskStorage } from './storages/disk-storage'

const GOOGLE_SERVICE_ACCOUNT: any = JSON.parse(decodeText(decodeBase64(import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT)))

async function send(): Promise<void> {
  let fcm: Record<string, any> | Error

  fcm = await DiskStorage.get('fcm')
  if (fcm instanceof Error) throw fcm

  await sendFcmMessage(GOOGLE_SERVICE_ACCOUNT, {
    notification: {
      title: 'Test notification from @aracna/fcm'
    },
    token: fcm.token
  })
}

await send()
