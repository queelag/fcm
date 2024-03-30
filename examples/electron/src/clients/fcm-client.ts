import { StorageItem } from '@aracna/core'
import { FcmClient, FcmClientLogin, FcmClientMessage, FcmClientMessageData } from '@aracna/fcm'
import { Notification } from 'electron'
import { DiskStorage } from '../storages/disk-storage'
import { getMainWindow } from '../windows/main-window'

const client = new FcmClient({ storage: { instance: DiskStorage } })

DiskStorage.get('fcm').then(async (item: StorageItem | Error) => {
  if (item instanceof Error) return

  client.setAcgID(item.acg.id).setAcgSecurityToken(item.acg.securityToken).setAuthSecret(item.ece.authSecret).setEcdhPrivateKey(item.ece.privateKey)
  client.connect()
})

client.on('login', (login: FcmClientLogin) => {
  console.log(login)
})

client.on('message', (message: FcmClientMessage) => {
  console.log(message)
})

client.on('message-data', async (data: FcmClientMessageData) => {
  let notification: Notification

  console.log(data)

  notification = new Notification({
    title: data.notification.title
  })

  notification.show()

  getMainWindow()?.webContents.send('fcm:message-data', data)
})

export { client as fcmClient }
