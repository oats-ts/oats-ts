import { factory, Identifier } from 'typescript'

export function createUndefined(): Identifier {
  return factory.createIdentifier('undefined')
}
