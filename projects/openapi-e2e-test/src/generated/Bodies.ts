import {
  HasIssues,
  HasNoIssues,
  HasRequestBody,
  HttpResponse,
  RawHttpRequest,
  RawHttpResponse,
} from '@oats-ts/openapi-http'
import { ClientConfiguration } from '@oats-ts/openapi-http-client'
import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { array, boolean, enumeration, items, lazy, number, object, shape, string } from '@oats-ts/validators'
import { NextFunction, Request, Response, Router } from 'express'

export type EnumType = 'A' | 'B' | 'C'

export type ObjectWithArrays = {
  boolArr: boolean[]
  enmArr: EnumType[]
  numArr: number[]
  strArr: string[]
}

export type ObjectWithNestedObjects = {
  arrObj: ObjectWithArrays
  primObj: ObjectWithPrimitives
}

export type ObjectWithPrimitives = {
  bool: boolean
  enm: EnumType
  num: number
  str: string
}

export const enumTypeTypeValidator = enumeration(['A', 'B', 'C'])

export const objectWithArraysTypeValidator = object(
  shape({
    boolArr: array(items(boolean())),
    enmArr: array(items(lazy(() => enumTypeTypeValidator))),
    numArr: array(items(number())),
    strArr: array(items(string())),
  }),
)

export const objectWithNestedObjectsTypeValidator = object(
  shape({
    arrObj: lazy(() => objectWithArraysTypeValidator),
    primObj: lazy(() => objectWithPrimitivesTypeValidator),
  }),
)

export const objectWithPrimitivesTypeValidator = object(
  shape({
    bool: boolean(),
    enm: lazy(() => enumTypeTypeValidator),
    num: number(),
    str: string(),
  }),
)

export function isEnumType(input: any): input is EnumType {
  return input === 'A' || input === 'B' || input === 'C'
}

export function isObjectWithArrays(input: any): input is ObjectWithArrays {
  return (
    input !== null &&
    typeof input === 'object' &&
    Array.isArray(input.boolArr) &&
    input.boolArr.every((item: any) => typeof item === 'boolean') &&
    Array.isArray(input.enmArr) &&
    input.enmArr.every((item: any) => isEnumType(item)) &&
    Array.isArray(input.numArr) &&
    input.numArr.every((item: any) => typeof item === 'number') &&
    Array.isArray(input.strArr) &&
    input.strArr.every((item: any) => typeof item === 'string')
  )
}

export function isObjectWithNestedObjects(input: any): input is ObjectWithNestedObjects {
  return (
    input !== null &&
    typeof input === 'object' &&
    isObjectWithArrays(input.arrObj) &&
    isObjectWithPrimitives(input.primObj)
  )
}

export function isObjectWithPrimitives(input: any): input is ObjectWithPrimitives {
  return (
    input !== null &&
    typeof input === 'object' &&
    typeof input.bool === 'boolean' &&
    isEnumType(input.enm) &&
    typeof input.num === 'number' &&
    typeof input.str === 'string'
  )
}

export type ArrObjRequest =
  | HasRequestBody<'application/json', ObjectWithArrays>
  | HasRequestBody<'application/yaml', ObjectWithArrays>

export type BoolRequest = HasRequestBody<'application/json', boolean> | HasRequestBody<'application/yaml', boolean>

export type BoolArrRequest =
  | HasRequestBody<'application/json', boolean[]>
  | HasRequestBody<'application/yaml', boolean[]>

export type EnmRequest = HasRequestBody<'application/json', EnumType> | HasRequestBody<'application/yaml', EnumType>

export type EnmArrRequest =
  | HasRequestBody<'application/json', EnumType[]>
  | HasRequestBody<'application/yaml', EnumType[]>

export type NestedObjRequest =
  | HasRequestBody<'application/json', ObjectWithNestedObjects>
  | HasRequestBody<'application/yaml', ObjectWithNestedObjects>

export type NumRequest = HasRequestBody<'application/json', number> | HasRequestBody<'application/yaml', number>

export type NumArrRequest = HasRequestBody<'application/json', number[]> | HasRequestBody<'application/yaml', number[]>

export type PrimObjRequest =
  | HasRequestBody<'application/json', ObjectWithPrimitives>
  | HasRequestBody<'application/yaml', ObjectWithPrimitives>

export type StrRequest = HasRequestBody<'application/json', string> | HasRequestBody<'application/yaml', string>

export type StrArrRequest = HasRequestBody<'application/json', string[]> | HasRequestBody<'application/yaml', string[]>

export type ArrObjServerRequest = (Partial<ArrObjRequest> & HasIssues) | (ArrObjRequest & HasNoIssues)

export type BoolServerRequest = (Partial<BoolRequest> & HasIssues) | (BoolRequest & HasNoIssues)

export type BoolArrServerRequest = (Partial<BoolArrRequest> & HasIssues) | (BoolArrRequest & HasNoIssues)

export type EnmServerRequest = (Partial<EnmRequest> & HasIssues) | (EnmRequest & HasNoIssues)

export type EnmArrServerRequest = (Partial<EnmArrRequest> & HasIssues) | (EnmArrRequest & HasNoIssues)

export type NestedObjServerRequest = (Partial<NestedObjRequest> & HasIssues) | (NestedObjRequest & HasNoIssues)

export type NumServerRequest = (Partial<NumRequest> & HasIssues) | (NumRequest & HasNoIssues)

export type NumArrServerRequest = (Partial<NumArrRequest> & HasIssues) | (NumArrRequest & HasNoIssues)

export type PrimObjServerRequest = (Partial<PrimObjRequest> & HasIssues) | (PrimObjRequest & HasNoIssues)

export type StrServerRequest = (Partial<StrRequest> & HasIssues) | (StrRequest & HasNoIssues)

export type StrArrServerRequest = (Partial<StrArrRequest> & HasIssues) | (StrArrRequest & HasNoIssues)

export const arrObjResponseBodyValidator = {
  200: { 'application/json': objectWithArraysTypeValidator, 'application/yaml': objectWithArraysTypeValidator },
} as const

export const boolArrResponseBodyValidator = {
  200: { 'application/json': array(items(boolean())), 'application/yaml': array(items(boolean())) },
} as const

export const boolResponseBodyValidator = {
  200: { 'application/json': boolean(), 'application/yaml': boolean() },
} as const

export const enmArrResponseBodyValidator = {
  200: {
    'application/json': array(items(lazy(() => enumTypeTypeValidator))),
    'application/yaml': array(items(lazy(() => enumTypeTypeValidator))),
  },
} as const

export const enmResponseBodyValidator = {
  200: { 'application/json': enumTypeTypeValidator, 'application/yaml': enumTypeTypeValidator },
} as const

export const nestedObjResponseBodyValidator = {
  200: {
    'application/json': objectWithNestedObjectsTypeValidator,
    'application/yaml': objectWithNestedObjectsTypeValidator,
  },
} as const

export const numArrResponseBodyValidator = {
  200: { 'application/json': array(items(number())), 'application/yaml': array(items(number())) },
} as const

export const numResponseBodyValidator = { 200: { 'application/json': number(), 'application/yaml': number() } } as const

export const primObjResponseBodyValidator = {
  200: { 'application/json': objectWithPrimitivesTypeValidator, 'application/yaml': objectWithPrimitivesTypeValidator },
} as const

export const strArrResponseBodyValidator = {
  200: { 'application/json': array(items(string())), 'application/yaml': array(items(string())) },
} as const

export const strResponseBodyValidator = { 200: { 'application/json': string(), 'application/yaml': string() } } as const

export const arrObjRequestBodyValidator = {
  'application/json': objectWithArraysTypeValidator,
  'application/yaml': objectWithArraysTypeValidator,
} as const

export const boolArrRequestBodyValidator = {
  'application/json': array(items(boolean())),
  'application/yaml': array(items(boolean())),
} as const

export const boolRequestBodyValidator = { 'application/json': boolean(), 'application/yaml': boolean() } as const

export const enmArrRequestBodyValidator = {
  'application/json': array(items(lazy(() => enumTypeTypeValidator))),
  'application/yaml': array(items(lazy(() => enumTypeTypeValidator))),
} as const

export const enmRequestBodyValidator = {
  'application/json': enumTypeTypeValidator,
  'application/yaml': enumTypeTypeValidator,
} as const

export const nestedObjRequestBodyValidator = {
  'application/json': objectWithNestedObjectsTypeValidator,
  'application/yaml': objectWithNestedObjectsTypeValidator,
} as const

export const numArrRequestBodyValidator = {
  'application/json': array(items(number())),
  'application/yaml': array(items(number())),
} as const

export const numRequestBodyValidator = { 'application/json': number(), 'application/yaml': number() } as const

export const primObjRequestBodyValidator = {
  'application/json': objectWithPrimitivesTypeValidator,
  'application/yaml': objectWithPrimitivesTypeValidator,
} as const

export const strArrRequestBodyValidator = {
  'application/json': array(items(string())),
  'application/yaml': array(items(string())),
} as const

export const strRequestBodyValidator = { 'application/json': string(), 'application/yaml': string() } as const

export type ArrObjResponse =
  | HttpResponse<ObjectWithArrays, 200, 'application/json', undefined>
  | HttpResponse<ObjectWithArrays, 200, 'application/yaml', undefined>

export type BoolResponse =
  | HttpResponse<boolean, 200, 'application/json', undefined>
  | HttpResponse<boolean, 200, 'application/yaml', undefined>

export type BoolArrResponse =
  | HttpResponse<boolean[], 200, 'application/json', undefined>
  | HttpResponse<boolean[], 200, 'application/yaml', undefined>

export type EnmResponse =
  | HttpResponse<EnumType, 200, 'application/json', undefined>
  | HttpResponse<EnumType, 200, 'application/yaml', undefined>

export type EnmArrResponse =
  | HttpResponse<EnumType[], 200, 'application/json', undefined>
  | HttpResponse<EnumType[], 200, 'application/yaml', undefined>

export type NestedObjResponse =
  | HttpResponse<ObjectWithNestedObjects, 200, 'application/json', undefined>
  | HttpResponse<ObjectWithNestedObjects, 200, 'application/yaml', undefined>

export type NumResponse =
  | HttpResponse<number, 200, 'application/json', undefined>
  | HttpResponse<number, 200, 'application/yaml', undefined>

export type NumArrResponse =
  | HttpResponse<number[], 200, 'application/json', undefined>
  | HttpResponse<number[], 200, 'application/yaml', undefined>

export type PrimObjResponse =
  | HttpResponse<ObjectWithPrimitives, 200, 'application/json', undefined>
  | HttpResponse<ObjectWithPrimitives, 200, 'application/yaml', undefined>

export type StrResponse =
  | HttpResponse<string, 200, 'application/json', undefined>
  | HttpResponse<string, 200, 'application/yaml', undefined>

export type StrArrResponse =
  | HttpResponse<string[], 200, 'application/json', undefined>
  | HttpResponse<string[], 200, 'application/yaml', undefined>

export async function arrObj(input: ArrObjRequest, configuration: ClientConfiguration): Promise<ArrObjResponse> {
  const requestUrl = await configuration.getUrl('/arr-obj', undefined)
  const requestHeaders = await configuration.getRequestHeaders(input, undefined)
  const requestBody = await configuration.getRequestBody(input)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    arrObjResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as ArrObjResponse
  return response
}

export async function bool(input: BoolRequest, configuration: ClientConfiguration): Promise<BoolResponse> {
  const requestUrl = await configuration.getUrl('/bool', undefined)
  const requestHeaders = await configuration.getRequestHeaders(input, undefined)
  const requestBody = await configuration.getRequestBody(input)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(rawResponse, statusCode, mimeType, boolResponseBodyValidator)
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as BoolResponse
  return response
}

export async function boolArr(input: BoolArrRequest, configuration: ClientConfiguration): Promise<BoolArrResponse> {
  const requestUrl = await configuration.getUrl('/bool-arr', undefined)
  const requestHeaders = await configuration.getRequestHeaders(input, undefined)
  const requestBody = await configuration.getRequestBody(input)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    boolArrResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as BoolArrResponse
  return response
}

export async function enm(input: EnmRequest, configuration: ClientConfiguration): Promise<EnmResponse> {
  const requestUrl = await configuration.getUrl('/enm', undefined)
  const requestHeaders = await configuration.getRequestHeaders(input, undefined)
  const requestBody = await configuration.getRequestBody(input)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(rawResponse, statusCode, mimeType, enmResponseBodyValidator)
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as EnmResponse
  return response
}

export async function enmArr(input: EnmArrRequest, configuration: ClientConfiguration): Promise<EnmArrResponse> {
  const requestUrl = await configuration.getUrl('/enm-arr', undefined)
  const requestHeaders = await configuration.getRequestHeaders(input, undefined)
  const requestBody = await configuration.getRequestBody(input)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    enmArrResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as EnmArrResponse
  return response
}

export async function nestedObj(
  input: NestedObjRequest,
  configuration: ClientConfiguration,
): Promise<NestedObjResponse> {
  const requestUrl = await configuration.getUrl('/nested-obj', undefined)
  const requestHeaders = await configuration.getRequestHeaders(input, undefined)
  const requestBody = await configuration.getRequestBody(input)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    nestedObjResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as NestedObjResponse
  return response
}

export async function num(input: NumRequest, configuration: ClientConfiguration): Promise<NumResponse> {
  const requestUrl = await configuration.getUrl('/num', undefined)
  const requestHeaders = await configuration.getRequestHeaders(input, undefined)
  const requestBody = await configuration.getRequestBody(input)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(rawResponse, statusCode, mimeType, numResponseBodyValidator)
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as NumResponse
  return response
}

export async function numArr(input: NumArrRequest, configuration: ClientConfiguration): Promise<NumArrResponse> {
  const requestUrl = await configuration.getUrl('/num-arr', undefined)
  const requestHeaders = await configuration.getRequestHeaders(input, undefined)
  const requestBody = await configuration.getRequestBody(input)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    numArrResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as NumArrResponse
  return response
}

export async function primObj(input: PrimObjRequest, configuration: ClientConfiguration): Promise<PrimObjResponse> {
  const requestUrl = await configuration.getUrl('/prim-obj', undefined)
  const requestHeaders = await configuration.getRequestHeaders(input, undefined)
  const requestBody = await configuration.getRequestBody(input)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    primObjResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as PrimObjResponse
  return response
}

export async function str(input: StrRequest, configuration: ClientConfiguration): Promise<StrResponse> {
  const requestUrl = await configuration.getUrl('/str', undefined)
  const requestHeaders = await configuration.getRequestHeaders(input, undefined)
  const requestBody = await configuration.getRequestBody(input)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(rawResponse, statusCode, mimeType, strResponseBodyValidator)
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as StrResponse
  return response
}

export async function strArr(input: StrArrRequest, configuration: ClientConfiguration): Promise<StrArrResponse> {
  const requestUrl = await configuration.getUrl('/str-arr', undefined)
  const requestHeaders = await configuration.getRequestHeaders(input, undefined)
  const requestBody = await configuration.getRequestBody(input)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    body: requestBody,
    headers: requestHeaders,
  }
  const rawResponse = await configuration.request(rawRequest)
  const mimeType = await configuration.getMimeType(rawResponse)
  const statusCode = await configuration.getStatusCode(rawResponse)
  const responseHeaders = await configuration.getResponseHeaders(rawResponse, statusCode, undefined)
  const responseBody = await configuration.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    strArrResponseBodyValidator,
  )
  const response = {
    mimeType,
    statusCode,
    headers: responseHeaders,
    body: responseBody,
  } as StrArrResponse
  return response
}

export type BodiesSdk = {
  arrObj(input: ArrObjRequest): Promise<ArrObjResponse>
  bool(input: BoolRequest): Promise<BoolResponse>
  boolArr(input: BoolArrRequest): Promise<BoolArrResponse>
  enm(input: EnmRequest): Promise<EnmResponse>
  enmArr(input: EnmArrRequest): Promise<EnmArrResponse>
  nestedObj(input: NestedObjRequest): Promise<NestedObjResponse>
  num(input: NumRequest): Promise<NumResponse>
  numArr(input: NumArrRequest): Promise<NumArrResponse>
  primObj(input: PrimObjRequest): Promise<PrimObjResponse>
  str(input: StrRequest): Promise<StrResponse>
  strArr(input: StrArrRequest): Promise<StrArrResponse>
}

export class BodiesClientSdk implements BodiesSdk {
  protected readonly config: ClientConfiguration
  public constructor(config: ClientConfiguration) {
    this.config = config
  }
  public async arrObj(input: ArrObjRequest): Promise<ArrObjResponse> {
    return arrObj(input, this.config)
  }
  public async bool(input: BoolRequest): Promise<BoolResponse> {
    return bool(input, this.config)
  }
  public async boolArr(input: BoolArrRequest): Promise<BoolArrResponse> {
    return boolArr(input, this.config)
  }
  public async enm(input: EnmRequest): Promise<EnmResponse> {
    return enm(input, this.config)
  }
  public async enmArr(input: EnmArrRequest): Promise<EnmArrResponse> {
    return enmArr(input, this.config)
  }
  public async nestedObj(input: NestedObjRequest): Promise<NestedObjResponse> {
    return nestedObj(input, this.config)
  }
  public async num(input: NumRequest): Promise<NumResponse> {
    return num(input, this.config)
  }
  public async numArr(input: NumArrRequest): Promise<NumArrResponse> {
    return numArr(input, this.config)
  }
  public async primObj(input: PrimObjRequest): Promise<PrimObjResponse> {
    return primObj(input, this.config)
  }
  public async str(input: StrRequest): Promise<StrResponse> {
    return str(input, this.config)
  }
  public async strArr(input: StrArrRequest): Promise<StrArrResponse> {
    return strArr(input, this.config)
  }
}

export class BodiesSdkStub implements BodiesSdk {
  public async arrObj(_input: ArrObjRequest): Promise<ArrObjResponse> {
    throw new Error('Stub method "arrObj" called. You should implement this method if you want to use it.')
  }
  public async bool(_input: BoolRequest): Promise<BoolResponse> {
    throw new Error('Stub method "bool" called. You should implement this method if you want to use it.')
  }
  public async boolArr(_input: BoolArrRequest): Promise<BoolArrResponse> {
    throw new Error('Stub method "boolArr" called. You should implement this method if you want to use it.')
  }
  public async enm(_input: EnmRequest): Promise<EnmResponse> {
    throw new Error('Stub method "enm" called. You should implement this method if you want to use it.')
  }
  public async enmArr(_input: EnmArrRequest): Promise<EnmArrResponse> {
    throw new Error('Stub method "enmArr" called. You should implement this method if you want to use it.')
  }
  public async nestedObj(_input: NestedObjRequest): Promise<NestedObjResponse> {
    throw new Error('Stub method "nestedObj" called. You should implement this method if you want to use it.')
  }
  public async num(_input: NumRequest): Promise<NumResponse> {
    throw new Error('Stub method "num" called. You should implement this method if you want to use it.')
  }
  public async numArr(_input: NumArrRequest): Promise<NumArrResponse> {
    throw new Error('Stub method "numArr" called. You should implement this method if you want to use it.')
  }
  public async primObj(_input: PrimObjRequest): Promise<PrimObjResponse> {
    throw new Error('Stub method "primObj" called. You should implement this method if you want to use it.')
  }
  public async str(_input: StrRequest): Promise<StrResponse> {
    throw new Error('Stub method "str" called. You should implement this method if you want to use it.')
  }
  public async strArr(_input: StrArrRequest): Promise<StrArrResponse> {
    throw new Error('Stub method "strArr" called. You should implement this method if you want to use it.')
  }
}

export type BodiesApi<T> = {
  arrObj(input: ArrObjServerRequest, frameworkInput: T): Promise<ArrObjResponse>
  bool(input: BoolServerRequest, frameworkInput: T): Promise<BoolResponse>
  boolArr(input: BoolArrServerRequest, frameworkInput: T): Promise<BoolArrResponse>
  enm(input: EnmServerRequest, frameworkInput: T): Promise<EnmResponse>
  enmArr(input: EnmArrServerRequest, frameworkInput: T): Promise<EnmArrResponse>
  nestedObj(input: NestedObjServerRequest, frameworkInput: T): Promise<NestedObjResponse>
  num(input: NumServerRequest, frameworkInput: T): Promise<NumResponse>
  numArr(input: NumArrServerRequest, frameworkInput: T): Promise<NumArrResponse>
  primObj(input: PrimObjServerRequest, frameworkInput: T): Promise<PrimObjResponse>
  str(input: StrServerRequest, frameworkInput: T): Promise<StrResponse>
  strArr(input: StrArrServerRequest, frameworkInput: T): Promise<StrArrResponse>
}

export const arrObjRoute: Router = Router().post(
  '/arr-obj',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    const [mimeTypeIssues, mimeType] = await configuration.getMimeType(frameworkInput, arrObjRequestBodyValidator)
    const [bodyIssues, body] = await configuration.getRequestBody(frameworkInput, mimeType, arrObjRequestBodyValidator)
    const issues = [...mimeTypeIssues, ...bodyIssues]
    const typedRequest = {
      mimeType,
      body,
      issues: issues.length > 0 ? issues : undefined,
    } as ArrObjServerRequest
    const typedResponse = await api.arrObj(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const boolRoute: Router = Router().post(
  '/bool',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    const [mimeTypeIssues, mimeType] = await configuration.getMimeType(frameworkInput, boolRequestBodyValidator)
    const [bodyIssues, body] = await configuration.getRequestBody(frameworkInput, mimeType, boolRequestBodyValidator)
    const issues = [...mimeTypeIssues, ...bodyIssues]
    const typedRequest = {
      mimeType,
      body,
      issues: issues.length > 0 ? issues : undefined,
    } as BoolServerRequest
    const typedResponse = await api.bool(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const boolArrRoute: Router = Router().post(
  '/bool-arr',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    const [mimeTypeIssues, mimeType] = await configuration.getMimeType(frameworkInput, boolArrRequestBodyValidator)
    const [bodyIssues, body] = await configuration.getRequestBody(frameworkInput, mimeType, boolArrRequestBodyValidator)
    const issues = [...mimeTypeIssues, ...bodyIssues]
    const typedRequest = {
      mimeType,
      body,
      issues: issues.length > 0 ? issues : undefined,
    } as BoolArrServerRequest
    const typedResponse = await api.boolArr(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const enmRoute: Router = Router().post(
  '/enm',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    const [mimeTypeIssues, mimeType] = await configuration.getMimeType(frameworkInput, enmRequestBodyValidator)
    const [bodyIssues, body] = await configuration.getRequestBody(frameworkInput, mimeType, enmRequestBodyValidator)
    const issues = [...mimeTypeIssues, ...bodyIssues]
    const typedRequest = {
      mimeType,
      body,
      issues: issues.length > 0 ? issues : undefined,
    } as EnmServerRequest
    const typedResponse = await api.enm(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const enmArrRoute: Router = Router().post(
  '/enm-arr',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    const [mimeTypeIssues, mimeType] = await configuration.getMimeType(frameworkInput, enmArrRequestBodyValidator)
    const [bodyIssues, body] = await configuration.getRequestBody(frameworkInput, mimeType, enmArrRequestBodyValidator)
    const issues = [...mimeTypeIssues, ...bodyIssues]
    const typedRequest = {
      mimeType,
      body,
      issues: issues.length > 0 ? issues : undefined,
    } as EnmArrServerRequest
    const typedResponse = await api.enmArr(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const nestedObjRoute: Router = Router().post(
  '/nested-obj',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    const [mimeTypeIssues, mimeType] = await configuration.getMimeType(frameworkInput, nestedObjRequestBodyValidator)
    const [bodyIssues, body] = await configuration.getRequestBody(
      frameworkInput,
      mimeType,
      nestedObjRequestBodyValidator,
    )
    const issues = [...mimeTypeIssues, ...bodyIssues]
    const typedRequest = {
      mimeType,
      body,
      issues: issues.length > 0 ? issues : undefined,
    } as NestedObjServerRequest
    const typedResponse = await api.nestedObj(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const numRoute: Router = Router().post(
  '/num',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    const [mimeTypeIssues, mimeType] = await configuration.getMimeType(frameworkInput, numRequestBodyValidator)
    const [bodyIssues, body] = await configuration.getRequestBody(frameworkInput, mimeType, numRequestBodyValidator)
    const issues = [...mimeTypeIssues, ...bodyIssues]
    const typedRequest = {
      mimeType,
      body,
      issues: issues.length > 0 ? issues : undefined,
    } as NumServerRequest
    const typedResponse = await api.num(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const numArrRoute: Router = Router().post(
  '/num-arr',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    const [mimeTypeIssues, mimeType] = await configuration.getMimeType(frameworkInput, numArrRequestBodyValidator)
    const [bodyIssues, body] = await configuration.getRequestBody(frameworkInput, mimeType, numArrRequestBodyValidator)
    const issues = [...mimeTypeIssues, ...bodyIssues]
    const typedRequest = {
      mimeType,
      body,
      issues: issues.length > 0 ? issues : undefined,
    } as NumArrServerRequest
    const typedResponse = await api.numArr(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const primObjRoute: Router = Router().post(
  '/prim-obj',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    const [mimeTypeIssues, mimeType] = await configuration.getMimeType(frameworkInput, primObjRequestBodyValidator)
    const [bodyIssues, body] = await configuration.getRequestBody(frameworkInput, mimeType, primObjRequestBodyValidator)
    const issues = [...mimeTypeIssues, ...bodyIssues]
    const typedRequest = {
      mimeType,
      body,
      issues: issues.length > 0 ? issues : undefined,
    } as PrimObjServerRequest
    const typedResponse = await api.primObj(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const strRoute: Router = Router().post(
  '/str',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    const [mimeTypeIssues, mimeType] = await configuration.getMimeType(frameworkInput, strRequestBodyValidator)
    const [bodyIssues, body] = await configuration.getRequestBody(frameworkInput, mimeType, strRequestBodyValidator)
    const issues = [...mimeTypeIssues, ...bodyIssues]
    const typedRequest = {
      mimeType,
      body,
      issues: issues.length > 0 ? issues : undefined,
    } as StrServerRequest
    const typedResponse = await api.str(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export const strArrRoute: Router = Router().post(
  '/str-arr',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    const [mimeTypeIssues, mimeType] = await configuration.getMimeType(frameworkInput, strArrRequestBodyValidator)
    const [bodyIssues, body] = await configuration.getRequestBody(frameworkInput, mimeType, strArrRequestBodyValidator)
    const issues = [...mimeTypeIssues, ...bodyIssues]
    const typedRequest = {
      mimeType,
      body,
      issues: issues.length > 0 ? issues : undefined,
    } as StrArrServerRequest
    const typedResponse = await api.strArr(typedRequest, frameworkInput)
    const rawResponse: RawHttpResponse = {
      headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
      statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
      body: await configuration.getResponseBody(frameworkInput, typedResponse),
    }
    return configuration.respond(frameworkInput, rawResponse)
  },
)

export type BodiesRoutes = {
  arrObjRoute: Router
  boolArrRoute: Router
  boolRoute: Router
  enmArrRoute: Router
  enmRoute: Router
  nestedObjRoute: Router
  numArrRoute: Router
  numRoute: Router
  primObjRoute: Router
  strArrRoute: Router
  strRoute: Router
}

export function createBodiesRoute(
  api: BodiesApi<ExpressParameters>,
  configuration: ServerConfiguration<ExpressParameters>,
  routes: Partial<BodiesRoutes> = {},
): Router {
  return Router().use(
    (_, response, next) => {
      response.locals['__oats_api'] = api
      response.locals['__oats_configuration'] = configuration
      next()
    },
    routes.arrObjRoute ?? arrObjRoute,
    routes.boolArrRoute ?? boolArrRoute,
    routes.boolRoute ?? boolRoute,
    routes.enmArrRoute ?? enmArrRoute,
    routes.enmRoute ?? enmRoute,
    routes.nestedObjRoute ?? nestedObjRoute,
    routes.numArrRoute ?? numArrRoute,
    routes.numRoute ?? numRoute,
    routes.primObjRoute ?? primObjRoute,
    routes.strArrRoute ?? strArrRoute,
    routes.strRoute ?? strRoute,
  )
}
