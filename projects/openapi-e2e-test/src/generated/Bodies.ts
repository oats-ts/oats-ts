import { HasRequestBody, HttpResponse, RawHttpRequest, RawHttpResponse } from '@oats-ts/openapi-http'
import { ClientConfiguration } from '@oats-ts/openapi-http-client'
import { ServerConfiguration } from '@oats-ts/openapi-http-server'
import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { Try } from '@oats-ts/try'
import { array, boolean, enumeration, items, lazy, number, object, shape, string } from '@oats-ts/validators'
import { NextFunction, Request, RequestHandler, Response, Router } from 'express'

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

export type ArrObjServerRequest =
  | HasRequestBody<'application/json', Try<ObjectWithArrays>>
  | HasRequestBody<'application/yaml', Try<ObjectWithArrays>>

export type BoolServerRequest =
  | HasRequestBody<'application/json', Try<boolean>>
  | HasRequestBody<'application/yaml', Try<boolean>>

export type BoolArrServerRequest =
  | HasRequestBody<'application/json', Try<boolean[]>>
  | HasRequestBody<'application/yaml', Try<boolean[]>>

export type EnmServerRequest =
  | HasRequestBody<'application/json', Try<EnumType>>
  | HasRequestBody<'application/yaml', Try<EnumType>>

export type EnmArrServerRequest =
  | HasRequestBody<'application/json', Try<EnumType[]>>
  | HasRequestBody<'application/yaml', Try<EnumType[]>>

export type NestedObjServerRequest =
  | HasRequestBody<'application/json', Try<ObjectWithNestedObjects>>
  | HasRequestBody<'application/yaml', Try<ObjectWithNestedObjects>>

export type NumServerRequest =
  | HasRequestBody<'application/json', Try<number>>
  | HasRequestBody<'application/yaml', Try<number>>

export type NumArrServerRequest =
  | HasRequestBody<'application/json', Try<number[]>>
  | HasRequestBody<'application/yaml', Try<number[]>>

export type PrimObjServerRequest =
  | HasRequestBody<'application/json', Try<ObjectWithPrimitives>>
  | HasRequestBody<'application/yaml', Try<ObjectWithPrimitives>>

export type StrServerRequest =
  | HasRequestBody<'application/json', Try<string>>
  | HasRequestBody<'application/yaml', Try<string>>

export type StrArrServerRequest =
  | HasRequestBody<'application/json', Try<string[]>>
  | HasRequestBody<'application/yaml', Try<string[]>>

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

export const arrObjRouter: Router = Router().post(
  '/arr-obj',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const mimeType = await configuration.getMimeType<'application/json' | 'application/yaml'>(frameworkInput)
      const body = await configuration.getRequestBody<'application/json' | 'application/yaml', ObjectWithArrays>(
        frameworkInput,
        mimeType,
        arrObjRequestBodyValidator,
      )
      const typedRequest: ArrObjServerRequest = {
        mimeType,
        body,
      }
      const typedResponse = await api.arrObj(typedRequest, frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const boolRouter: Router = Router().post(
  '/bool',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const mimeType = await configuration.getMimeType<'application/json' | 'application/yaml'>(frameworkInput)
      const body = await configuration.getRequestBody<'application/json' | 'application/yaml', boolean>(
        frameworkInput,
        mimeType,
        boolRequestBodyValidator,
      )
      const typedRequest: BoolServerRequest = {
        mimeType,
        body,
      }
      const typedResponse = await api.bool(typedRequest, frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const boolArrRouter: Router = Router().post(
  '/bool-arr',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const mimeType = await configuration.getMimeType<'application/json' | 'application/yaml'>(frameworkInput)
      const body = await configuration.getRequestBody<'application/json' | 'application/yaml', boolean[]>(
        frameworkInput,
        mimeType,
        boolArrRequestBodyValidator,
      )
      const typedRequest: BoolArrServerRequest = {
        mimeType,
        body,
      }
      const typedResponse = await api.boolArr(typedRequest, frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const enmRouter: Router = Router().post(
  '/enm',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const mimeType = await configuration.getMimeType<'application/json' | 'application/yaml'>(frameworkInput)
      const body = await configuration.getRequestBody<'application/json' | 'application/yaml', EnumType>(
        frameworkInput,
        mimeType,
        enmRequestBodyValidator,
      )
      const typedRequest: EnmServerRequest = {
        mimeType,
        body,
      }
      const typedResponse = await api.enm(typedRequest, frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const enmArrRouter: Router = Router().post(
  '/enm-arr',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const mimeType = await configuration.getMimeType<'application/json' | 'application/yaml'>(frameworkInput)
      const body = await configuration.getRequestBody<'application/json' | 'application/yaml', EnumType[]>(
        frameworkInput,
        mimeType,
        enmArrRequestBodyValidator,
      )
      const typedRequest: EnmArrServerRequest = {
        mimeType,
        body,
      }
      const typedResponse = await api.enmArr(typedRequest, frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const nestedObjRouter: Router = Router().post(
  '/nested-obj',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const mimeType = await configuration.getMimeType<'application/json' | 'application/yaml'>(frameworkInput)
      const body = await configuration.getRequestBody<'application/json' | 'application/yaml', ObjectWithNestedObjects>(
        frameworkInput,
        mimeType,
        nestedObjRequestBodyValidator,
      )
      const typedRequest: NestedObjServerRequest = {
        mimeType,
        body,
      }
      const typedResponse = await api.nestedObj(typedRequest, frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const numRouter: Router = Router().post(
  '/num',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const mimeType = await configuration.getMimeType<'application/json' | 'application/yaml'>(frameworkInput)
      const body = await configuration.getRequestBody<'application/json' | 'application/yaml', number>(
        frameworkInput,
        mimeType,
        numRequestBodyValidator,
      )
      const typedRequest: NumServerRequest = {
        mimeType,
        body,
      }
      const typedResponse = await api.num(typedRequest, frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const numArrRouter: Router = Router().post(
  '/num-arr',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const mimeType = await configuration.getMimeType<'application/json' | 'application/yaml'>(frameworkInput)
      const body = await configuration.getRequestBody<'application/json' | 'application/yaml', number[]>(
        frameworkInput,
        mimeType,
        numArrRequestBodyValidator,
      )
      const typedRequest: NumArrServerRequest = {
        mimeType,
        body,
      }
      const typedResponse = await api.numArr(typedRequest, frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const primObjRouter: Router = Router().post(
  '/prim-obj',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const mimeType = await configuration.getMimeType<'application/json' | 'application/yaml'>(frameworkInput)
      const body = await configuration.getRequestBody<'application/json' | 'application/yaml', ObjectWithPrimitives>(
        frameworkInput,
        mimeType,
        primObjRequestBodyValidator,
      )
      const typedRequest: PrimObjServerRequest = {
        mimeType,
        body,
      }
      const typedResponse = await api.primObj(typedRequest, frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const strRouter: Router = Router().post(
  '/str',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const mimeType = await configuration.getMimeType<'application/json' | 'application/yaml'>(frameworkInput)
      const body = await configuration.getRequestBody<'application/json' | 'application/yaml', string>(
        frameworkInput,
        mimeType,
        strRequestBodyValidator,
      )
      const typedRequest: StrServerRequest = {
        mimeType,
        body,
      }
      const typedResponse = await api.str(typedRequest, frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export const strArrRouter: Router = Router().post(
  '/str-arr',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const frameworkInput: ExpressParameters = { request, response, next }
    const configuration: ServerConfiguration<ExpressParameters> = response.locals['__oats_configuration']
    const api: BodiesApi<ExpressParameters> = response.locals['__oats_api']
    try {
      const mimeType = await configuration.getMimeType<'application/json' | 'application/yaml'>(frameworkInput)
      const body = await configuration.getRequestBody<'application/json' | 'application/yaml', string[]>(
        frameworkInput,
        mimeType,
        strArrRequestBodyValidator,
      )
      const typedRequest: StrArrServerRequest = {
        mimeType,
        body,
      }
      const typedResponse = await api.strArr(typedRequest, frameworkInput)
      const rawResponse: RawHttpResponse = {
        headers: await configuration.getResponseHeaders(frameworkInput, typedResponse, undefined),
        statusCode: await configuration.getStatusCode(frameworkInput, typedResponse),
        body: await configuration.getResponseBody(frameworkInput, typedResponse),
      }
      return configuration.respond(frameworkInput, rawResponse)
    } catch (error) {
      configuration.handleError(frameworkInput, error)
      throw error
    }
  },
)

export type BodiesRouters = {
  arrObjRouter: Router
  boolArrRouter: Router
  boolRouter: Router
  enmArrRouter: Router
  enmRouter: Router
  nestedObjRouter: Router
  numArrRouter: Router
  numRouter: Router
  primObjRouter: Router
  strArrRouter: Router
  strRouter: Router
}

export function createBodiesRouter(
  api: BodiesApi<ExpressParameters>,
  configuration: ServerConfiguration<ExpressParameters>,
  routes: Partial<BodiesRouters> = {},
): Router {
  return Router().use(
    (_, response, next) => {
      response.locals['__oats_api'] = api
      response.locals['__oats_configuration'] = configuration
      next()
    },
    routes.arrObjRouter ?? arrObjRouter,
    routes.boolArrRouter ?? boolArrRouter,
    routes.boolRouter ?? boolRouter,
    routes.enmArrRouter ?? enmArrRouter,
    routes.enmRouter ?? enmRouter,
    routes.nestedObjRouter ?? nestedObjRouter,
    routes.numArrRouter ?? numArrRouter,
    routes.numRouter ?? numRouter,
    routes.primObjRouter ?? primObjRouter,
    routes.strArrRouter ?? strArrRouter,
    routes.strRouter ?? strRouter,
  )
}

export const bodiesCorsMiddleware =
  (...origins: string[]): RequestHandler =>
  (request: Request, response: Response, next: NextFunction) => {
    if (
      typeof request.headers.origin === 'string' &&
      (origins.indexOf(request.headers.origin) >= 0 || origins.indexOf('*') >= 0)
    ) {
      response.setHeader('Access-Control-Allow-Origin', request.headers.origin)
      response.setHeader('Access-Control-Allow-Methods', 'POST')
      response.setHeader('Access-Control-Allow-Headers', 'content-type')
    }
    next()
  }
