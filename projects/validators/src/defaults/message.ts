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
  enumeration: ({ expected }: EnumerationMessageData) =>
    `should be one of ${expected.map((value) => (typeof value === 'string' ? `"${value}"` : value)).join(',')}`,
  literal: ({ expected }: LiteralMessageData) =>
    `should be ${typeof expected === 'string' ? `"${expected}"` : expected}`,
  minLength: ({ expected }: MinLengthMessageData) => `length should be at least ${expected}`,
  restrictKeys: () => `should not have key`,
  union: ({ expected }: UnionMessageData) => `should be one of ${expected.join(', ')}`,
}

export function message(type: string, path: string, data?: any): string {
  const msgProducer = messageProducers?.[type as ValidatorType]
  return isNil(msgProducer) ? 'unknown' : msgProducer(data)
}
