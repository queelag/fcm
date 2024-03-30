import { app, BrowserWindow } from 'electron'
import './ipc/ipc-fcm'
import { createMainWindow } from './windows/main-window'

if (require('electron-squirrel-startup')) {
  app.quit()
}

app.on('ready', () => createMainWindow())

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})
