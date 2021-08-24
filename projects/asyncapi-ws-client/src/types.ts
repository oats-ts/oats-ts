export type WebsocketListener<S> = (message: S) => void

export type WebsocketAdapter = HasSubscribe<any> & HasPublish<any> & HasConnect

export type WebsocketConfig = {
  serialize(input: any): any
  deserialize(input: any): any
  socket(url: string): W3CWebsocket
  adapter(url: string, config: WebsocketConfig): WebsocketAdapter
}

export type HasConnect = {
  connect(): Promise<void>
  disconnect(): Promise<void>
}

export type HasPublish<T> = {
  publish(data: T): void
}

export type HasSubscribe<T> = {
  subscribe(listener: WebsocketListener<T>): void
  unsubscribe(listener: WebsocketListener<T>): void
  unsubscribeAll(): void
}

export type PubSocket<P> = HasConnect & HasPublish<P>
export type SubSocket<S> = HasConnect & HasSubscribe<S>
export type PubSubSocket<P, S> = HasConnect & HasSubscribe<S> & HasPublish<P>

export type W3CCloseEvent = {
  code: number
  reason: string
  wasClean: boolean
}

export type W3CMessageEvent = {
  data: any
}

export declare class W3CWebsocket {
  static CONNECTING: number
  static OPEN: number
  static CLOSING: number
  static CLOSED: number

  constructor(url: string)

  url: string
  readyState: number
  protocol?: string | undefined

  binaryType: 'arraybuffer' | 'blob'

  CONNECTING: number
  OPEN: number
  CLOSING: number
  CLOSED: number

  onopen: () => void
  onerror: (error: Error) => void
  onclose: (event: W3CCloseEvent) => void
  onmessage: (message: W3CMessageEvent) => void

  send(data: any): void
  close(code?: number, reason?: string): void
}
