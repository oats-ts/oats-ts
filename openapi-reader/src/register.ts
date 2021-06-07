import { ReadContext, ReadInput } from './types'

export function register(input: ReadInput<any>, context: ReadContext): void {
  const { uri, data } = input
  context.byUri.set(uri, data)
  context.byComponent.set(data, uri)
}
