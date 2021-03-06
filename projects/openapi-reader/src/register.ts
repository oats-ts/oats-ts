import { ReadContext, ReadInput } from './internalTypings'

export function register(input: ReadInput<any>, context: ReadContext): void {
  const { uri, data } = input
  context.cache.uriToObject.set(uri, data)
  context.cache.objectToUri.set(data, uri)
}
