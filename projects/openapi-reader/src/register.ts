import { ReadContext, ReadInput } from './internalTypings'

export function register(input: ReadInput<any>, context: ReadContext): void {
  const { uri, data } = input
  context.uriToObject.set(uri, data)
  context.objectToUri.set(data, uri)
}
