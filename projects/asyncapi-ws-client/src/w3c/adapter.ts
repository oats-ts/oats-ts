import { WebsocketAdapter, WebsocketConfig } from '../types'
import { W3CWebsocketAdapter } from './W3CWebsocketAdapter'

export function adapter(url: string, config: WebsocketConfig): WebsocketAdapter {
  return new W3CWebsocketAdapter(url, config)
}
