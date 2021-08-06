import { ReferenceObject } from '@oats-ts/json-schema-model'
import { ReadContext } from './internalTypings'

export function registerNamed<T>(name: string, input: T | ReferenceObject, context: ReadContext): void {
  context.objectToName.set(input, name)
}
