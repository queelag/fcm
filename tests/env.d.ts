/// <reference types="vitest/import-meta" />

interface ImportMetaEnv {
  readonly VITE_FCM_SENDER_ID: string
  readonly VITE_FCM_SERVER_KEY: string
  readonly VITE_FCM_TOKEN: string
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_VAPID_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}