import { WebsocketAdapter, WebsocketConfig, WebsocketListener } from '../types'
import { W3CCloseEvent, W3CMessageEvent, W3CWebsocket } from '../types'

export class W3CWebsocketAdapter implements WebsocketAdapter {
  private readonly url: string
  private readonly config: WebsocketConfig

  private socket: W3CWebsocket
  private listeners: WebsocketListener<any>[]

  public constructor(url: string, config: WebsocketConfig) {
    this.url = url
    this.config = config
  }

  public async connect(): Promise<void> {
    await this.disconnect()
    this.socket = this.config.socket(this.url)
    await new Promise<void>((resolve, reject) => {
      this.socket.onopen = () => resolve()
      this.socket.onerror = () => {
        reject()
        this.destroySocket()
      }
    })
    this.socket.onmessage = (e: MessageEvent) => {
      this.onMessage(e)
    }
  }

  public async disconnect(): Promise<void> {
    const { socket } = this
    if (socket === undefined || socket === null || socket.readyState === socket.CLOSED) {
      return
    }
    if (socket.readyState !== socket.CLOSING) {
      socket.close()
    }
    return new Promise<void>((resolve, reject) => {
      socket.onclose = (e: W3CCloseEvent) => {
        this.destroySocket()
        resolve()
      }
      socket.onerror = (e: any) => {
        this.destroySocket()
        reject(e)
      }
    })
  }

  private onMessage(e: W3CMessageEvent): void {
    const data = this.config.deserialize(e.data)
    for (let i = 0; i < this.listeners.length; i += 1) {
      this.listeners[i](data)
    }
  }

  private destroySocket(): void {
    const { socket } = this
    if (socket === undefined || socket === null) {
      return
    }
    socket.onopen = undefined
    socket.onclose = undefined
    socket.onmessage = undefined
    socket.onerror = undefined
    this.socket = undefined
  }

  public subscribe(listener: WebsocketListener<any>): void {
    this.listeners = this.listeners.concat([listener])
  }

  public unsubscribe(listener: WebsocketListener<any>): void {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  unsubscribeAll(): void {
    this.listeners = []
  }

  public publish(data: any): void {
    this.socket.send(this.config.serialize(data))
  }
}
