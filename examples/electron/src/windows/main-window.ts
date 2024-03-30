import { BrowserWindow } from 'electron'
import path from 'path'

let window: BrowserWindow | undefined

export function createMainWindow(): BrowserWindow {
  window = new BrowserWindow({
    autoHideMenuBar: true,
    height: 480,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    width: 640
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  return window
}

export function getMainWindow(): BrowserWindow | undefined {
  return window
}
