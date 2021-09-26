import { value } from './index'
import { ValueErrorData, ValueSuccessData, ValueTestData } from './value.testutils'

export type LiteralType = 'cat'
export type EnumType = 'cat' | 'dog' | 'racoon'

export const stringParser = value.string()
export const numberParser = value.number()
export const booleanParser = value.boolean()
export const literalParser = value.string(value.literal<string, LiteralType>('cat'))
export const enumParser = value.string(value.enumeration<string, EnumType>(['cat', 'dog', 'racoon']))

export const optionalStringParser = value.optional(stringParser)
export const optionalNumberParser = value.optional(numberParser)
export const optionalBooleanParser = value.optional(booleanParser)
export const optionalLiteralParser = value.optional(literalParser)
export const optionalEnumParser = value.optional(enumParser)

const optionalOk: ValueSuccessData<any, any>[] = [
  [undefined, undefined],
  [undefined, null],
]

const stringOk: ValueSuccessData<string, string>[] = [
  ['foo', 'foo'],
  ['bar', 'bar'],
  ['', ''],
]

const numberOk: ValueSuccessData<string, number>[] = [
  [1, '1'],
  [11232, '11232'],
  [11.34, '11.34'],
]

const booleanOk: ValueSuccessData<string, boolean>[] = [
  [true, 'true'],
  [false, 'false'],
]

const enumOk: ValueSuccessData<string, EnumType>[] = [
  ['cat', 'cat'],
  ['dog', 'dog'],
  ['racoon', 'racoon'],
]

const literalOk: ValueSuccessData<string, LiteralType>[] = [['cat', 'cat']]

const requiredError: ValueErrorData<any>[] = [[undefined], [null]]
const stringError: ValueErrorData<any>[] = [[1], [true], [{}], [[]]]
const numberError: ValueErrorData<any>[] = [['foo'], [true], [{}], [[]]]
const booleanError: ValueErrorData<any>[] = [['foo'], ['tRUe'], ['False'], [{}], [[]]]
const enumError: ValueErrorData<any>[] = [['Cat'], ['frog'], ['raCoon'], [1], [true], [{}], [[]]]
const literalError: ValueErrorData<any>[] = [['Cat'], ['frog'], ['raCoon'], [1], [true], [{}], [[]]]

export const stringValueData: ValueTestData<string, string> = {
  data: stringOk,
  error: [...requiredError, ...stringError],
}

export const numberValueData: ValueTestData<string, number> = {
  data: numberOk,
  error: [...requiredError, ...numberError],
}

export const booleanValueData: ValueTestData<string, boolean> = {
  data: booleanOk,
  error: [...requiredError, ...booleanError],
}

export const enumValueData: ValueTestData<string, EnumType> = {
  data: enumOk,
  error: [...requiredError, ...enumError],
}

export const literalValueData: ValueTestData<string, LiteralType> = {
  data: literalOk,
  error: [...requiredError, ...literalError],
}

export const optStringValueData: ValueTestData<string, string> = {
  data: [...optionalOk, ...stringOk],
  error: stringError,
}

export const optNumberValueData: ValueTestData<string, number> = {
  data: [...optionalOk, ...numberOk],
  error: numberError,
}

export const optBooleanValueData: ValueTestData<string, boolean> = {
  data: [...optionalOk, ...booleanOk],
  error: booleanError,
}

export const optEnumValueData: ValueTestData<string, EnumType> = {
  data: [...optionalOk, ...enumOk],
  error: enumError,
}

export const optLiteralValueData: ValueTestData<string, LiteralType> = {
  data: [...optionalOk, ...literalOk],
  error: literalError,
}
