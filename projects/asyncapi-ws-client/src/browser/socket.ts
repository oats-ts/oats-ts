import { W3CWebsocket } from '../types'

export function socket(url: string): W3CWebsocket {
  // Casted to any to iron out API inconsistencies with the node version
  // The differences are irrelevant, but break type checking.
  return new WebSocket(url) as any
}
