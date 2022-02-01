import { ClientAdapter, HasRequestBody, HttpResponse, RawHttpRequest } from '@oats-ts/openapi-http'
import { array, boolean, enumeration, lazy, number, object, shape, string } from '@oats-ts/validators'

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
    boolArr: array(),
    enmArr: array(),
    numArr: array(),
    strArr: array(),
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
    Array.isArray(input.enmArr) &&
    Array.isArray(input.numArr) &&
    Array.isArray(input.strArr)
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

export const arrObjResponseBodyValidator = {
  200: { 'application/json': objectWithArraysTypeValidator, 'application/yaml': objectWithArraysTypeValidator },
} as const

export const boolArrResponseBodyValidator = {
  200: { 'application/json': array(), 'application/yaml': array() },
} as const

export const boolResponseBodyValidator = {
  200: { 'application/json': boolean(), 'application/yaml': boolean() },
} as const

export const enmArrResponseBodyValidator = {
  200: { 'application/json': array(), 'application/yaml': array() },
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
  200: { 'application/json': array(), 'application/yaml': array() },
} as const

export const numResponseBodyValidator = { 200: { 'application/json': number(), 'application/yaml': number() } } as const

export const primObjResponseBodyValidator = {
  200: { 'application/json': objectWithPrimitivesTypeValidator, 'application/yaml': objectWithPrimitivesTypeValidator },
} as const

export const strArrResponseBodyValidator = {
  200: { 'application/json': array(), 'application/yaml': array() },
} as const

export const strResponseBodyValidator = { 200: { 'application/json': string(), 'application/yaml': string() } } as const

export async function arrObj(input: ArrObjRequest, configuration: ClientAdapter): Promise<ArrObjResponse> {
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

export async function bool(input: BoolRequest, configuration: ClientAdapter): Promise<BoolResponse> {
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

export async function boolArr(input: BoolArrRequest, configuration: ClientAdapter): Promise<BoolArrResponse> {
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

export async function enm(input: EnmRequest, configuration: ClientAdapter): Promise<EnmResponse> {
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

export async function enmArr(input: EnmArrRequest, configuration: ClientAdapter): Promise<EnmArrResponse> {
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

export async function nestedObj(input: NestedObjRequest, configuration: ClientAdapter): Promise<NestedObjResponse> {
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

export async function num(input: NumRequest, configuration: ClientAdapter): Promise<NumResponse> {
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

export async function numArr(input: NumArrRequest, configuration: ClientAdapter): Promise<NumArrResponse> {
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

export async function primObj(input: PrimObjRequest, configuration: ClientAdapter): Promise<PrimObjResponse> {
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

export async function str(input: StrRequest, configuration: ClientAdapter): Promise<StrResponse> {
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

export async function strArr(input: StrArrRequest, configuration: ClientAdapter): Promise<StrArrResponse> {
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

export class BodiesSdkImpl implements BodiesSdk {
  protected readonly config: ClientAdapter
  public constructor(config: ClientAdapter) {
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
