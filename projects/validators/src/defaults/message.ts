import {
  EnumerationMessageData,
  LiteralMessageData,
  MinLengthMessageData,
  UnionMessageData,
  ValidatorType,
} from '../typings'
import { isNil } from '../utils'

const messageProducers: Partial<Record<ValidatorType, (data?: any) => string>> = {
  array: () => 'should be an array',
  boolean: () => 'should be a boolean',
  nil: () => 'should be null or undefined',
  number: () => 'should be a number',
  object: () => 'should be an object',
  string: () => 'should be a string',
  enumeration: ({ hint }: EnumerationMessageData) =>
    `should be one of ${hint.map((value) => (typeof value === 'string' ? `"${value}"` : value)).join(',')}`,
  literal: ({ hint }: LiteralMessageData) => `should be ${typeof hint === 'string' ? `"${hint}"` : hint}`,
  minLength: ({ hint }: MinLengthMessageData) => `length should be at least ${hint}`,
  restrictKey: ({ hint }) => `should not have key "${hint}"`,
  union: ({ hint }: UnionMessageData) => `should be one of ${hint.join(', ')}`,
}

export function message(type: string, path: string, data?: any): string {
  const msgProducer = messageProducers?.[type as ValidatorType]
  return isNil(msgProducer) ? 'unknown' : msgProducer(data)
}
