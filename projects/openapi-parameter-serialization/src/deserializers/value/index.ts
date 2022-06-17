import { booleanParser } from './booleanParser'
import { enumerationParser } from './enumerationParser'
import { identityParser } from './identityParser'
import { literalParser } from './literalParser'
import { numberParser } from './numberParser'
import { optionalParser } from './optionalParser'
import { stringParser } from './stringParser'

export const value = {
  number: numberParser,
  boolean: booleanParser,
  string: stringParser,
  enumeration: enumerationParser,
  literal: literalParser,
  identity: identityParser,
  optional: optionalParser,
}
