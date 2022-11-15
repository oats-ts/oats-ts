import { hash } from './hash'
import { ReadContext } from './internalTypings'

export function register2(data: any, uri: string, context: ReadContext): void {
  context.cache.uriToObject.set(uri, data)
  context.cache.objectToUri.set(data, uri)
  context.cache.objectToHash.set(data, hash(JSON.stringify(data)))
}
