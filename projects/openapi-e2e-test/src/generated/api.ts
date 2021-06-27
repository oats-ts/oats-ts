import {
  boolean,
  any,
  array,
  enumeration,
  object,
  optional,
  shape,
  string,
  literal,
  union,
  number,
} from '@oats-ts/validators'
import { HttpResponse, ResponseParserHint, RequestConfig } from '@oats-ts/http'
import { query, createQuerySerializer, joinUrl } from '@oats-ts/openapi-parameter-serialization'

export type NamedBoolean = boolean

export type NamedComplexObject = {
  enumProperty?: 'Racoon' | 'Dog' | 'Cat'
  enumReferenceProperty?: NamedEnum
  'non-identifier * property}'?: string
  recordProperty?: Record<string, boolean>
  referenceArrayProperty?: NamedRecord[]
  referenceProperty?: NamedRecord
  stringArrayProperty?: string[]
}

/**
 * @deprecated
 */
export type NamedDeprecatedObject = {
  /**
   * @deprecated
   */
  deprecatedProperty?: string
}

export enum NamedEnum {
  A = 'A',
  B = 'B',
  C = 'C',
}

export type NamedMidLevelUnion = NamedUnionLeaf2 | NamedUnionLeaf3

export type NamedNumber = number

export type NamedPrimitiveUnion = number | string | boolean

/**
 * This is a named record.
 */
export type NamedRecord = Record<string, number>

export type NamedSimpleObject = {
  booleanProperty: boolean
  numberProperty: number
  optionalBooleanProperty?: boolean
  optionalNumberProperty?: number
  optionalStringProperty?: string
  stringProperty: string
}

export type NamedString = string

export type NamedStringArray = string[]

export type NamedTopLevelUnion = NamedMidLevelUnion | NamedUnionLeaf1

export type NamedUnionLeaf1 = {
  topLevelType: 'NamedUnionLeaf1'
  namedUnionLeaf1Property?: string
}

export type NamedUnionLeaf2 = {
  midLevelType: 'NamedUnionLeaf2'
  topLevelType: 'NamedMidLevelUnion'
  namedUnionLeaf2Property?: number
}

export type NamedUnionLeaf3 = {
  midLevelType: 'NamedUnionLeaf3'
  topLevelType: 'NamedMidLevelUnion'
  namedUnionLeaf3Property?: boolean
}

export const namedBooleanValidator = boolean()

export const namedComplexObjectValidator = object(
  shape({
    enumProperty: optional(enumeration(['Racoon', 'Dog', 'Cat'])),
    enumReferenceProperty: optional(any),
    'non-identifier * property}': optional(string()),
    recordProperty: optional(object()),
    referenceArrayProperty: optional(array(any)),
    referenceProperty: optional(any),
    stringArrayProperty: optional(array(string())),
  }),
)

export const namedDeprecatedObjectValidator = object(shape({ deprecatedProperty: optional(string()) }))

export const namedEnumValidator = enumeration(['A', 'B', 'C'])

export const namedMidLevelUnionValidator = union({
  NamedUnionLeaf2: any,
  NamedUnionLeaf3: any,
})

export const namedNumberValidator = number()

export const namedPrimitiveUnionValidator = union({
  number: number(),
  string: string(),
  boolean: boolean(),
})

export const namedRecordValidator = object()

export const namedSimpleObjectValidator = object(
  shape({
    booleanProperty: boolean(),
    numberProperty: number(),
    optionalBooleanProperty: optional(boolean()),
    optionalNumberProperty: optional(number()),
    optionalStringProperty: optional(string()),
    stringProperty: string(),
  }),
)

export const namedStringValidator = string()

export const namedStringArrayValidator = array(string())

export const namedTopLevelUnionValidator = union({
  NamedMidLevelUnion: any,
  NamedUnionLeaf1: any,
})

export const namedUnionLeaf1Validator = object(
  shape({
    topLevelType: literal('NamedUnionLeaf1'),
    namedUnionLeaf1Property: optional(string()),
  }),
)

export const namedUnionLeaf2Validator = object(
  shape({
    midLevelType: literal('NamedUnionLeaf2'),
    topLevelType: literal('NamedMidLevelUnion'),
    namedUnionLeaf2Property: optional(number()),
  }),
)

export const namedUnionLeaf3Validator = object(
  shape({
    midLevelType: literal('NamedUnionLeaf3'),
    topLevelType: literal('NamedMidLevelUnion'),
    namedUnionLeaf3Property: optional(boolean()),
  }),
)

export function isNamedBoolean(input: any): input is NamedBoolean {
  return typeof input === 'boolean'
}

export function isNamedComplexObject(input: any): input is NamedComplexObject {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.enumProperty === null ||
      input.enumProperty === undefined ||
      input.enumProperty === 'Racoon' ||
      input.enumProperty === 'Dog' ||
      input.enumProperty === 'Cat') &&
    (input.enumReferenceProperty === null ||
      input.enumReferenceProperty === undefined ||
      isNamedEnum(input.enumReferenceProperty)) &&
    (input['non-identifier * property}'] === null ||
      input['non-identifier * property}'] === undefined ||
      typeof input['non-identifier * property}'] === 'string') &&
    (input.recordProperty === null ||
      input.recordProperty === undefined ||
      (input.recordProperty !== null &&
        typeof input.recordProperty === 'object' &&
        Object.keys(input.recordProperty).every((key) => typeof input.recordProperty[key] === 'boolean'))) &&
    (input.referenceArrayProperty === null ||
      input.referenceArrayProperty === undefined ||
      (Array.isArray(input.referenceArrayProperty) &&
        input.referenceArrayProperty.every((item: any) => isNamedRecord(item)))) &&
    (input.referenceProperty === null ||
      input.referenceProperty === undefined ||
      isNamedRecord(input.referenceProperty)) &&
    (input.stringArrayProperty === null ||
      input.stringArrayProperty === undefined ||
      (Array.isArray(input.stringArrayProperty) &&
        input.stringArrayProperty.every((item: any) => typeof item === 'string')))
  )
}

export function isNamedDeprecatedObject(input: any): input is NamedDeprecatedObject {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.deprecatedProperty === null ||
      input.deprecatedProperty === undefined ||
      typeof input.deprecatedProperty === 'string')
  )
}

export function isNamedEnum(input: any): input is NamedEnum {
  return input === 'A' || input === 'B' || input === 'C'
}

export function isNamedMidLevelUnion(input: any): input is NamedMidLevelUnion {
  return isNamedUnionLeaf2(input) || isNamedUnionLeaf3(input)
}

export function isNamedNumber(input: any): input is NamedNumber {
  return typeof input === 'number'
}

export function isNamedPrimitiveUnion(input: any): input is NamedPrimitiveUnion {
  return typeof input === 'number' || typeof input === 'string' || typeof input === 'boolean'
}

export function isNamedRecord(input: any): input is NamedRecord {
  return (
    input !== null && typeof input === 'object' && Object.keys(input).every((key) => typeof input[key] === 'number')
  )
}

export function isNamedSimpleObject(input: any): input is NamedSimpleObject {
  return (
    input !== null &&
    typeof input === 'object' &&
    typeof input.booleanProperty === 'boolean' &&
    typeof input.numberProperty === 'number' &&
    (input.optionalBooleanProperty === null ||
      input.optionalBooleanProperty === undefined ||
      typeof input.optionalBooleanProperty === 'boolean') &&
    (input.optionalNumberProperty === null ||
      input.optionalNumberProperty === undefined ||
      typeof input.optionalNumberProperty === 'number') &&
    (input.optionalStringProperty === null ||
      input.optionalStringProperty === undefined ||
      typeof input.optionalStringProperty === 'string') &&
    typeof input.stringProperty === 'string'
  )
}

export function isNamedString(input: any): input is NamedString {
  return typeof input === 'string'
}

export function isNamedStringArray(input: any): input is NamedStringArray {
  return Array.isArray(input) && input.every((item: any) => typeof item === 'string')
}

export function isNamedTopLevelUnion(input: any): input is NamedTopLevelUnion {
  return isNamedMidLevelUnion(input) || isNamedUnionLeaf1(input)
}

export function isNamedUnionLeaf1(input: any): input is NamedUnionLeaf1 {
  return (
    input !== null &&
    typeof input === 'object' &&
    input.topLevelType === 'NamedUnionLeaf1' &&
    (input.namedUnionLeaf1Property === null ||
      input.namedUnionLeaf1Property === undefined ||
      typeof input.namedUnionLeaf1Property === 'string')
  )
}

export function isNamedUnionLeaf2(input: any): input is NamedUnionLeaf2 {
  return (
    input !== null &&
    typeof input === 'object' &&
    input.midLevelType === 'NamedUnionLeaf2' &&
    input.topLevelType === 'NamedMidLevelUnion' &&
    (input.namedUnionLeaf2Property === null ||
      input.namedUnionLeaf2Property === undefined ||
      typeof input.namedUnionLeaf2Property === 'number')
  )
}

export function isNamedUnionLeaf3(input: any): input is NamedUnionLeaf3 {
  return (
    input !== null &&
    typeof input === 'object' &&
    input.midLevelType === 'NamedUnionLeaf3' &&
    input.topLevelType === 'NamedMidLevelUnion' &&
    (input.namedUnionLeaf3Property === null ||
      input.namedUnionLeaf3Property === undefined ||
      typeof input.namedUnionLeaf3Property === 'boolean')
  )
}

export type GetCatDogQueryParameters = {
  foo?: string
}

export type GetCatDogResponse = HttpResponse<NamedSimpleObject, 200>

export type GetCatDogInput = {
  query: GetCatDogQueryParameters
}

export const querySerializer = createQuerySerializer<GetCatDogQueryParameters>({ foo: query.form.primitive({}) })

export const responseParserHint: ResponseParserHint = { 200: { 'application/json': undefined } }

export async function getCatDog(input: GetCatDogInput, config: RequestConfig): Promise<GetCatDogResponse> {
  return config.parse(
    await config.request({ url: joinUrl(config.baseUrl, '/cat/dog', querySerializer(input.query)), method: 'get' }),
    responseParserHint,
  )
}

export type Api = {
  getCatDog(input: GetCatDogInput, config?: Partial<RequestConfig>): Promise<GetCatDogResponse>
}

export class ApiImpl implements Api {
  private readonly config: RequestConfig
  public constructor(config: RequestConfig) {
    this.config = config
  }
  public async getCatDog(input: GetCatDogInput, config: Partial<RequestConfig> = {}): Promise<GetCatDogResponse> {
    return getCatDog(input, { ...this.config, ...config })
  }
}

export class ApiStub implements Api {
  protected fallback(): never {
    throw new Error('Not implemented.')
  }
  public async getCatDog(input: GetCatDogInput, config: Partial<RequestConfig> = {}): Promise<GetCatDogResponse> {
    return this.fallback()
  }
}
