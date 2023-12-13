import NodeEventEmitter from 'events'
import { EventEmitterEventMap } from '../definitions/interfaces.js'

export class EventEmitter<T extends EventEmitterEventMap> extends NodeEventEmitter {
  addListener<K extends keyof T>(eventName: K, listener: T[K]): this {
    return super.addListener(eventName as string | symbol, listener)
  }

  eventNames(): (string | symbol)[] {
    return super.eventNames()
  }

  emit<K extends keyof T>(eventName: K, ...args: Parameters<T[K]>): boolean {
    return super.emit(eventName as string | symbol, ...args)
  }

  getMaxListeners(): number {
    return super.getMaxListeners()
  }

  listenerCount<K extends keyof T>(eventName: K, listener?: Function | undefined): number {
    return super.listenerCount(eventName as string | symbol, listener)
  }

  listeners<K extends keyof T>(eventName: K): Function[] {
    return super.listeners(eventName as string | symbol)
  }

  off<K extends keyof T>(eventName: K, listener: T[K]): this {
    return super.off(eventName as string | symbol, listener)
  }

  on<K extends keyof T>(eventName: K, listener: T[K]): this {
    return super.on(eventName as string | symbol, listener)
  }

  once<K extends keyof T>(eventName: K, listener: T[K]): this {
    return super.once(eventName as string | symbol, listener)
  }

  prependListener<K extends keyof T>(eventName: K, listener: T[K]): this {
    return super.prependListener(eventName as string | symbol, listener)
  }

  prependOnceListener<K extends keyof T>(eventName: K, listener: T[K]): this {
    return super.prependOnceListener(eventName as string | symbol, listener)
  }

  rawListeners<K extends keyof T>(eventName: K): Function[] {
    return super.rawListeners(eventName as string | symbol)
  }

  removeListener<K extends keyof T>(eventName: K, listener: T[K]): this {
    return super.removeListener(eventName as string | symbol, listener)
  }

  removeAllListeners<K extends keyof T>(eventName?: K): this {
    return super.removeAllListeners(eventName as string | symbol)
  }

  setMaxListeners(n: number): this {
    return super.setMaxListeners(n)
  }
}
