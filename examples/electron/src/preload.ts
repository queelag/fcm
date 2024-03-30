import { FcmClientMessageData } from '@aracna/fcm'
import { IpcRenderer, IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'

declare global {
  interface Window {
    fcm: {
      connect: () => Promise<void>
      disconnect: () => Promise<void>
      getToken: () => Promise<string | undefined>
      isRegistered: () => Promise<boolean>
      onMessageData: (listener: (event: IpcRendererEvent, data: FcmClientMessageData) => any) => IpcRenderer
      register: () => Promise<void>
      removeMessageDataListener: (listener: (...args: any[]) => any) => IpcRenderer
    }
  }
}

const fcm: (typeof window)['fcm'] = {
  connect: () => ipcRenderer.invoke('fcm:connect'),
  disconnect: () => ipcRenderer.invoke('fcm:disconnect'),
  getToken: () => ipcRenderer.invoke('fcm:get-token'),
  isRegistered: () => ipcRenderer.invoke('fcm:is-registered'),
  onMessageData: (listener: (...args: any[]) => any) => ipcRenderer.on('fcm:message-data', listener),
  register: () => ipcRenderer.invoke('fcm:register'),
  removeMessageDataListener: (listener: (...args: any[]) => any) => ipcRenderer.off('fcm:message-data', listener)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('fcm', fcm)
  } catch (error) {
    console.error(error)
  }
} else {
  window.fcm = fcm
}
