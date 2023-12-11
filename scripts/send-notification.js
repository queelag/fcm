import { config } from 'dotenv'

config()

const FCM_CLIENT_TOKEN = process.env.FCM_CLIENT_TOKEN
const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY

const response = await fetch('https://fcm.googleapis.com/fcm/send', {
  body: JSON.stringify({
    to: FCM_CLIENT_TOKEN,
    notification: {
      title: 'Title',
      body: 'Body'
    }
  }),
  headers: {
    authorization: `key=${FCM_SERVER_KEY}`,
    'content-type': 'application/json'
  },
  method: 'POST'
})
console.log(response)
