import {
  enumeration,
  boolean,
  any,
  array,
  items,
  object,
  optional,
  shape,
  string,
  lazy,
  union,
  number,
  literal,
} from '@oats-ts/validators'
import { HttpResponse, ResponseExpectations, RequestConfig, execute, StatusCode } from '@oats-ts/http'
import {
  joinUrl,
  header,
  createHeaderSerializer,
  path,
  createPathSerializer,
  query,
  createQuerySerializer,
} from '@oats-ts/openapi-parameter-serialization'

export enum AdditionalServiceType {
  CHECKED_BAGS = 'CHECKED_BAGS',
  MEALS = 'MEALS',
  SEATS = 'SEATS',
  OTHER_SERVICES = 'OTHER_SERVICES',
}

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

export const additionalServiceTypeValidator = enumeration(['CHECKED_BAGS', 'MEALS', 'SEATS', 'OTHER_SERVICES'])

export const namedBooleanValidator = boolean()

export const namedComplexObjectValidator = object(
  shape({
    enumProperty: optional(enumeration(['Racoon', 'Dog', 'Cat'])),
    enumReferenceProperty: optional(any),
    'non-identifier * property}': optional(string()),
    recordProperty: optional(object()),
    referenceArrayProperty: optional(array(items(any))),
    referenceProperty: optional(any),
    stringArrayProperty: optional(array(items(string()))),
  }),
)

export const namedDeprecatedObjectValidator = object(shape({ deprecatedProperty: optional(string()) }))

export const namedEnumValidator = enumeration(['A', 'B', 'C'])

export const namedMidLevelUnionValidator = union({
  NamedUnionLeaf2: lazy(() => namedUnionLeaf2Validator),
  NamedUnionLeaf3: lazy(() => namedUnionLeaf3Validator),
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

export const namedStringArrayValidator = array(items(string()))

export const namedTopLevelUnionValidator = union({
  NamedMidLevelUnion: lazy(() => namedMidLevelUnionValidator),
  NamedUnionLeaf1: lazy(() => namedUnionLeaf1Validator),
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

export function isAdditionalServiceType(input: any): input is AdditionalServiceType {
  return input === 'CHECKED_BAGS' || input === 'MEALS' || input === 'SEATS' || input === 'OTHER_SERVICES'
}

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

export type GetWithHeaderParamsHeaderParameters = {
  'X-String-In-Headers': string
  'X-Number-In-Headers': number
  'X-Boolean-In-Headers': boolean
  'X-Enum-In-Headers': 'bear' | 'racoon' | 'cat'
}

export type GetWithPathParamsPathParameters = {
  stringInPath: string
  numberInPath: number
  booleanInPath: boolean
  enumInPath: 'bear' | 'racoon' | 'cat'
}

export type GetWithQueryParamsQueryParameters = {
  stringInQuery: string
  numberInQuery: number
  booleanInQuery: boolean
  enumInQuery: 'bear' | 'racoon' | 'cat'
}

export type GetSimpleNamedObjectResponse = HttpResponse<NamedSimpleObject, 200>

export const getSimpleNamedObjectExpectations: ResponseExpectations = {
  200: { 'application/json': namedSimpleObjectValidator },
}

export async function getSimpleNamedObject(config: RequestConfig): Promise<GetSimpleNamedObjectResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, '/simple-named-object'), method: 'get' },
    config,
    getSimpleNamedObjectExpectations,
  )
}

export type GetWithHeaderParamsResponse = HttpResponse<NamedSimpleObject, 200>

export type GetWithHeaderParamsInput = {
  headers: GetWithHeaderParamsHeaderParameters
}

export const getWithHeaderParamsHeadersSerializer = createHeaderSerializer<GetWithHeaderParamsHeaderParameters>({
  'X-String-In-Headers': header.simple.primitive({ required: true }),
  'X-Number-In-Headers': header.simple.primitive({ required: true }),
  'X-Boolean-In-Headers': header.simple.primitive({ required: true }),
  'X-Enum-In-Headers': header.simple.primitive({ required: true }),
})

export const getWithHeaderParamsExpectations: ResponseExpectations = {
  200: { 'application/json': namedSimpleObjectValidator },
}

export async function getWithHeaderParams(
  input: GetWithHeaderParamsInput,
  config: RequestConfig,
): Promise<GetWithHeaderParamsResponse> {
  return execute(
    {
      url: joinUrl(config.baseUrl, '/header-params'),
      method: 'get',
      headers: getWithHeaderParamsHeadersSerializer(input.headers),
    },
    config,
    getWithHeaderParamsExpectations,
  )
}

export type GetWithMultipleResponsesResponse =
  | HttpResponse<NamedSimpleObject, 200>
  | HttpResponse<
      {
        test?: NamedSimpleObject
      },
      201
    >
  | HttpResponse<NamedDeprecatedObject, 205>
  | HttpResponse<NamedComplexObject, Exclude<StatusCode, 200 | 201 | 205>>

export const getWithMultipleResponsesExpectations: ResponseExpectations = {
  200: { 'application/json': namedSimpleObjectValidator },
  201: { 'application/json': object(shape({ test: optional(any) })) },
  205: { 'application/json': namedDeprecatedObjectValidator },
  default: { 'application/json': namedComplexObjectValidator },
}

export async function getWithMultipleResponses(config: RequestConfig): Promise<GetWithMultipleResponsesResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, '/multiple-responses'), method: 'get' },
    config,
    getWithMultipleResponsesExpectations,
  )
}

export type GetWithPathParamsResponse = HttpResponse<NamedSimpleObject, 200>

export type GetWithPathParamsInput = {
  path: GetWithPathParamsPathParameters
}

export const getWithPathParamsPathSerializer = createPathSerializer<GetWithPathParamsPathParameters>(
  '/path-params/{stringInPath}/{numberInPath}/{booleanInPath}/{enumInPath}',
  {
    stringInPath: path.simple.primitive({}),
    numberInPath: path.simple.primitive({}),
    booleanInPath: path.simple.primitive({}),
    enumInPath: path.simple.primitive({}),
  },
)

export const getWithPathParamsExpectations: ResponseExpectations = {
  200: { 'application/json': namedSimpleObjectValidator },
}

export async function getWithPathParams(
  input: GetWithPathParamsInput,
  config: RequestConfig,
): Promise<GetWithPathParamsResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, getWithPathParamsPathSerializer(input.path)), method: 'get' },
    config,
    getWithPathParamsExpectations,
  )
}

export type GetWithQueryParamsResponse = HttpResponse<NamedSimpleObject, 200>

export type GetWithQueryParamsInput = {
  query: GetWithQueryParamsQueryParameters
}

export const getWithQueryParamsQuerySerializer = createQuerySerializer<GetWithQueryParamsQueryParameters>({
  stringInQuery: query.form.primitive({ required: true }),
  numberInQuery: query.form.primitive({ required: true }),
  booleanInQuery: query.form.primitive({ required: true }),
  enumInQuery: query.form.primitive({ required: true }),
})

export const getWithQueryParamsExpectations: ResponseExpectations = {
  200: { 'application/json': namedSimpleObjectValidator },
}

export async function getWithQueryParams(
  input: GetWithQueryParamsInput,
  config: RequestConfig,
): Promise<GetWithQueryParamsResponse> {
  return execute(
    { url: joinUrl(config.baseUrl, '/query-params', getWithQueryParamsQuerySerializer(input.query)), method: 'get' },
    config,
    getWithQueryParamsExpectations,
  )
}

export type PostSimpleNamedObjectResponse = HttpResponse<NamedSimpleObject, 200>

export type PostSimpleNamedObjectInput = {
  contentType: 'application/json'
  body: NamedSimpleObject
}

export const postSimpleNamedObjectExpectations: ResponseExpectations = {
  200: { 'application/json': namedSimpleObjectValidator },
}

export async function postSimpleNamedObject(
  input: PostSimpleNamedObjectInput,
  config: RequestConfig,
): Promise<PostSimpleNamedObjectResponse> {
  return execute(
    {
      url: joinUrl(config.baseUrl, '/simple-named-object'),
      method: 'post',
      body: await config.serialize(input.contentType, input.body),
      headers: { 'content-type': input.contentType },
    },
    config,
    postSimpleNamedObjectExpectations,
  )
}

export type Api = {
  getSimpleNamedObject(config?: Partial<RequestConfig>): Promise<GetSimpleNamedObjectResponse>
  getWithHeaderParams(
    input: GetWithHeaderParamsInput,
    config?: Partial<RequestConfig>,
  ): Promise<GetWithHeaderParamsResponse>
  getWithMultipleResponses(config?: Partial<RequestConfig>): Promise<GetWithMultipleResponsesResponse>
  getWithPathParams(input: GetWithPathParamsInput, config?: Partial<RequestConfig>): Promise<GetWithPathParamsResponse>
  getWithQueryParams(
    input: GetWithQueryParamsInput,
    config?: Partial<RequestConfig>,
  ): Promise<GetWithQueryParamsResponse>
  postSimpleNamedObject(
    input: PostSimpleNamedObjectInput,
    config?: Partial<RequestConfig>,
  ): Promise<PostSimpleNamedObjectResponse>
}

export class ApiImpl implements Api {
  private readonly config: RequestConfig
  public constructor(config: RequestConfig) {
    this.config = config
  }
  public async getSimpleNamedObject(config: Partial<RequestConfig> = {}): Promise<GetSimpleNamedObjectResponse> {
    return getSimpleNamedObject({ ...this.config, ...config })
  }
  public async getWithHeaderParams(
    input: GetWithHeaderParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithHeaderParamsResponse> {
    return getWithHeaderParams(input, { ...this.config, ...config })
  }
  public async getWithMultipleResponses(
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithMultipleResponsesResponse> {
    return getWithMultipleResponses({ ...this.config, ...config })
  }
  public async getWithPathParams(
    input: GetWithPathParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithPathParamsResponse> {
    return getWithPathParams(input, { ...this.config, ...config })
  }
  public async getWithQueryParams(
    input: GetWithQueryParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithQueryParamsResponse> {
    return getWithQueryParams(input, { ...this.config, ...config })
  }
  public async postSimpleNamedObject(
    input: PostSimpleNamedObjectInput,
    config: Partial<RequestConfig> = {},
  ): Promise<PostSimpleNamedObjectResponse> {
    return postSimpleNamedObject(input, { ...this.config, ...config })
  }
}

export class ApiStub implements Api {
  protected fallback(): never {
    throw new Error('Not implemented.')
  }
  public async getSimpleNamedObject(config: Partial<RequestConfig> = {}): Promise<GetSimpleNamedObjectResponse> {
    return this.fallback()
  }
  public async getWithHeaderParams(
    input: GetWithHeaderParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithHeaderParamsResponse> {
    return this.fallback()
  }
  public async getWithMultipleResponses(
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithMultipleResponsesResponse> {
    return this.fallback()
  }
  public async getWithPathParams(
    input: GetWithPathParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithPathParamsResponse> {
    return this.fallback()
  }
  public async getWithQueryParams(
    input: GetWithQueryParamsInput,
    config: Partial<RequestConfig> = {},
  ): Promise<GetWithQueryParamsResponse> {
    return this.fallback()
  }
  public async postSimpleNamedObject(
    input: PostSimpleNamedObjectInput,
    config: Partial<RequestConfig> = {},
  ): Promise<PostSimpleNamedObjectResponse> {
    return this.fallback()
  }
}
