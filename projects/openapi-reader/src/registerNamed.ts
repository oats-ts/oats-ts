import { ReferenceObject } from 'openapi3-ts'
import { ReadContext } from './internalTypings'

export function registerNamed<T>(name: string, input: T | ReferenceObject, context: ReadContext): void {
  context.objectToName.set(input, name)
}
