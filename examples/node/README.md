# Node.js Example for @aracna/fcm

Please define the following variables inside a .env file.

| Name                        | Source           | Type   |
| --------------------------- | ---------------- | ------ |
| VITE_FIREBASE_API_KEY       | Firebase Console | string |
| VITE_FIREBASE_APP_ID        | Firebase Console | string |
| VITE_FIREBASE_PROJECT_ID    | Firebase Console | string |
| VITE_GOOGLE_SERVICE_ACCOUNT | Firebase Console | string |
| VITE_VAPID_KEY              | Firebase Console | string |

The `VITE_GOOGLE_SERVICE_ACCOUNT` variable must be base64 encoded.

## Install Dependencies

```
pnpm i
```

## Register & Listen

This command registers a new device to FCM if not already registered, then connects with the client and listens to any incoming messages.

```
pnpm start
```

## Send Test Message

This command will send a test message to the client that is listening when you run `pnpm start`, you should see it appear in its logs once sent.

```
pnpm send-message
```
