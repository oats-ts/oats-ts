import { w3cwebsocket as WebSocket } from 'websocket'
import { W3CWebsocket } from '../types'

export function socket(url: string): W3CWebsocket {
  return new WebSocket(url)
}
