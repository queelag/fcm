/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_GOOGLE_SERVICE_ACCOUNT: string
  readonly VITE_VAPID_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
