# @aracna/fcm - Electron Example

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

## Run

```
pnpm start
```

## Send Test Message

This command will send a test message to the client that is listening when you run `pnpm start`, it should be visible both on the console and on the renderer once the client receives it.

```
pnpm send-message
```
