import { FcmClientMessageData } from '@aracna/fcm'
import './index.css'

window.fcm.onMessageData((_, data: FcmClientMessageData) => {
  let li: HTMLLIElement

  li = document.createElement('li')
  li.innerHTML = JSON.stringify(data, null, 2)

  document.getElementById('messages')?.appendChild(li)
})

window.fcm.register().then(() => {
  window.fcm.connect()
})
