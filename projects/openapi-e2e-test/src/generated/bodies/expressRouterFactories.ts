/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/bodies.json (originating from oats-ts/oats-schemas)
 */

import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { RawHttpResponse, ServerAdapter } from '@oats-ts/openapi-runtime'
import { IRouter, NextFunction, Request, Response, Router } from 'express'
import { BodiesApi } from './apiType'
import { bodiesCorsConfiguration } from './corsConfiguration'
import {
  arrObjRequestBodyValidator,
  boolArrRequestBodyValidator,
  boolRequestBodyValidator,
  enmArrRequestBodyValidator,
  enmRequestBodyValidator,
  nestedObjRequestBodyValidator,
  numArrRequestBodyValidator,
  numRequestBodyValidator,
  optPrimTupleRequestBodyValidator,
  primObjRequestBodyValidator,
  primTupleRequestBodyValidator,
  strArrRequestBodyValidator,
  strRequestBodyValidator,
} from './requestBodyValidators'
import {
  ArrObjServerRequest,
  BoolArrServerRequest,
  BoolServerRequest,
  EnmArrServerRequest,
  EnmServerRequest,
  NestedObjServerRequest,
  NumArrServerRequest,
  NumServerRequest,
  OptPrimTupleServerRequest,
  PrimObjServerRequest,
  PrimTupleServerRequest,
  StrArrServerRequest,
  StrServerRequest,
} from './requestServerTypes'
import {
  EnumType,
  ObjectWithArrays,
  ObjectWithNestedObjects,
  ObjectWithPrimitives,
  PrimitiveOptionalTupleType,
  PrimitiveTupleType,
} from './types'

export function createArrObjRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/arr-obj',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_14n8ypu']
      const api: BodiesApi = response.locals['__oats_api_14n8ypu']
      try {
        const mimeType = await adapter.getMimeType<'application/json' | 'application/yaml'>(toolkit)
        const body = await adapter.getRequestBody<'application/json' | 'application/yaml', ObjectWithArrays>(
          toolkit,
          true,
          mimeType,
          arrObjRequestBodyValidator,
        )
        const typedRequest: ArrObjServerRequest = {
          mimeType,
          body,
        }
        const corsConfig = bodiesCorsConfiguration?.['/arr-obj']?.post
        const corsHeaders = await adapter.getCorsHeaders(toolkit, corsConfig)
        const typedResponse = await api.arrObj(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, corsHeaders),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}

export function createBoolArrRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/bool-arr',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_14n8ypu']
      const api: BodiesApi = response.locals['__oats_api_14n8ypu']
      try {
        const mimeType = await adapter.getMimeType<'application/json' | 'application/yaml'>(toolkit)
        const body = await adapter.getRequestBody<'application/json' | 'application/yaml', boolean[]>(
          toolkit,
          true,
          mimeType,
          boolArrRequestBodyValidator,
        )
        const typedRequest: BoolArrServerRequest = {
          mimeType,
          body,
        }
        const corsConfig = bodiesCorsConfiguration?.['/bool-arr']?.post
        const corsHeaders = await adapter.getCorsHeaders(toolkit, corsConfig)
        const typedResponse = await api.boolArr(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, corsHeaders),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}

export function createBoolRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/bool',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_14n8ypu']
      const api: BodiesApi = response.locals['__oats_api_14n8ypu']
      try {
        const mimeType = await adapter.getMimeType<'application/json' | 'application/yaml'>(toolkit)
        const body = await adapter.getRequestBody<'application/json' | 'application/yaml', boolean>(
          toolkit,
          true,
          mimeType,
          boolRequestBodyValidator,
        )
        const typedRequest: BoolServerRequest = {
          mimeType,
          body,
        }
        const corsConfig = bodiesCorsConfiguration?.['/bool']?.post
        const corsHeaders = await adapter.getCorsHeaders(toolkit, corsConfig)
        const typedResponse = await api.bool(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, corsHeaders),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}

export function createEnmArrRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/enm-arr',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_14n8ypu']
      const api: BodiesApi = response.locals['__oats_api_14n8ypu']
      try {
        const mimeType = await adapter.getMimeType<'application/json' | 'application/yaml'>(toolkit)
        const body = await adapter.getRequestBody<'application/json' | 'application/yaml', EnumType[]>(
          toolkit,
          true,
          mimeType,
          enmArrRequestBodyValidator,
        )
        const typedRequest: EnmArrServerRequest = {
          mimeType,
          body,
        }
        const corsConfig = bodiesCorsConfiguration?.['/enm-arr']?.post
        const corsHeaders = await adapter.getCorsHeaders(toolkit, corsConfig)
        const typedResponse = await api.enmArr(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, corsHeaders),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}

export function createEnmRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/enm',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_14n8ypu']
      const api: BodiesApi = response.locals['__oats_api_14n8ypu']
      try {
        const mimeType = await adapter.getMimeType<'application/json' | 'application/yaml'>(toolkit)
        const body = await adapter.getRequestBody<'application/json' | 'application/yaml', EnumType>(
          toolkit,
          true,
          mimeType,
          enmRequestBodyValidator,
        )
        const typedRequest: EnmServerRequest = {
          mimeType,
          body,
        }
        const corsConfig = bodiesCorsConfiguration?.['/enm']?.post
        const corsHeaders = await adapter.getCorsHeaders(toolkit, corsConfig)
        const typedResponse = await api.enm(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, corsHeaders),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}

export function createNestedObjRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/nested-obj',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_14n8ypu']
      const api: BodiesApi = response.locals['__oats_api_14n8ypu']
      try {
        const mimeType = await adapter.getMimeType<'application/json' | 'application/yaml'>(toolkit)
        const body = await adapter.getRequestBody<'application/json' | 'application/yaml', ObjectWithNestedObjects>(
          toolkit,
          true,
          mimeType,
          nestedObjRequestBodyValidator,
        )
        const typedRequest: NestedObjServerRequest = {
          mimeType,
          body,
        }
        const corsConfig = bodiesCorsConfiguration?.['/nested-obj']?.post
        const corsHeaders = await adapter.getCorsHeaders(toolkit, corsConfig)
        const typedResponse = await api.nestedObj(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, corsHeaders),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}

export function createNumArrRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/num-arr',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_14n8ypu']
      const api: BodiesApi = response.locals['__oats_api_14n8ypu']
      try {
        const mimeType = await adapter.getMimeType<'application/json' | 'application/yaml'>(toolkit)
        const body = await adapter.getRequestBody<'application/json' | 'application/yaml', number[]>(
          toolkit,
          true,
          mimeType,
          numArrRequestBodyValidator,
        )
        const typedRequest: NumArrServerRequest = {
          mimeType,
          body,
        }
        const corsConfig = bodiesCorsConfiguration?.['/num-arr']?.post
        const corsHeaders = await adapter.getCorsHeaders(toolkit, corsConfig)
        const typedResponse = await api.numArr(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, corsHeaders),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}

export function createNumRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/num',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_14n8ypu']
      const api: BodiesApi = response.locals['__oats_api_14n8ypu']
      try {
        const mimeType = await adapter.getMimeType<'application/json' | 'application/yaml'>(toolkit)
        const body = await adapter.getRequestBody<'application/json' | 'application/yaml', number>(
          toolkit,
          true,
          mimeType,
          numRequestBodyValidator,
        )
        const typedRequest: NumServerRequest = {
          mimeType,
          body,
        }
        const corsConfig = bodiesCorsConfiguration?.['/num']?.post
        const corsHeaders = await adapter.getCorsHeaders(toolkit, corsConfig)
        const typedResponse = await api.num(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, corsHeaders),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}

export function createOptPrimTupleRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/opt-prim-tuple',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_14n8ypu']
      const api: BodiesApi = response.locals['__oats_api_14n8ypu']
      try {
        const mimeType = await adapter.getMimeType<'application/json' | 'application/yaml'>(toolkit)
        const body = await adapter.getRequestBody<'application/json' | 'application/yaml', PrimitiveOptionalTupleType>(
          toolkit,
          true,
          mimeType,
          optPrimTupleRequestBodyValidator,
        )
        const typedRequest: OptPrimTupleServerRequest = {
          mimeType,
          body,
        }
        const corsConfig = bodiesCorsConfiguration?.['/opt-prim-tuple']?.post
        const corsHeaders = await adapter.getCorsHeaders(toolkit, corsConfig)
        const typedResponse = await api.optPrimTuple(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, corsHeaders),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}

export function createPrimObjRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/prim-obj',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_14n8ypu']
      const api: BodiesApi = response.locals['__oats_api_14n8ypu']
      try {
        const mimeType = await adapter.getMimeType<'application/json' | 'application/yaml'>(toolkit)
        const body = await adapter.getRequestBody<'application/json' | 'application/yaml', ObjectWithPrimitives>(
          toolkit,
          true,
          mimeType,
          primObjRequestBodyValidator,
        )
        const typedRequest: PrimObjServerRequest = {
          mimeType,
          body,
        }
        const corsConfig = bodiesCorsConfiguration?.['/prim-obj']?.post
        const corsHeaders = await adapter.getCorsHeaders(toolkit, corsConfig)
        const typedResponse = await api.primObj(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, corsHeaders),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}

export function createPrimTupleRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/prim-tuple',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_14n8ypu']
      const api: BodiesApi = response.locals['__oats_api_14n8ypu']
      try {
        const mimeType = await adapter.getMimeType<'application/json' | 'application/yaml'>(toolkit)
        const body = await adapter.getRequestBody<'application/json' | 'application/yaml', PrimitiveTupleType>(
          toolkit,
          true,
          mimeType,
          primTupleRequestBodyValidator,
        )
        const typedRequest: PrimTupleServerRequest = {
          mimeType,
          body,
        }
        const corsConfig = bodiesCorsConfiguration?.['/prim-tuple']?.post
        const corsHeaders = await adapter.getCorsHeaders(toolkit, corsConfig)
        const typedResponse = await api.primTuple(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, corsHeaders),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}

export function createStrArrRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/str-arr',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_14n8ypu']
      const api: BodiesApi = response.locals['__oats_api_14n8ypu']
      try {
        const mimeType = await adapter.getMimeType<'application/json' | 'application/yaml'>(toolkit)
        const body = await adapter.getRequestBody<'application/json' | 'application/yaml', string[]>(
          toolkit,
          true,
          mimeType,
          strArrRequestBodyValidator,
        )
        const typedRequest: StrArrServerRequest = {
          mimeType,
          body,
        }
        const corsConfig = bodiesCorsConfiguration?.['/str-arr']?.post
        const corsHeaders = await adapter.getCorsHeaders(toolkit, corsConfig)
        const typedResponse = await api.strArr(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, corsHeaders),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}

export function createStrRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router()).post(
    '/str',
    async (request: Request, response: Response, next: NextFunction): Promise<void> => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_14n8ypu']
      const api: BodiesApi = response.locals['__oats_api_14n8ypu']
      try {
        const mimeType = await adapter.getMimeType<'application/json' | 'application/yaml'>(toolkit)
        const body = await adapter.getRequestBody<'application/json' | 'application/yaml', string>(
          toolkit,
          true,
          mimeType,
          strRequestBodyValidator,
        )
        const typedRequest: StrServerRequest = {
          mimeType,
          body,
        }
        const corsConfig = bodiesCorsConfiguration?.['/str']?.post
        const corsHeaders = await adapter.getCorsHeaders(toolkit, corsConfig)
        const typedResponse = await api.str(typedRequest)
        const rawResponse: RawHttpResponse = {
          headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined, corsHeaders),
          statusCode: await adapter.getStatusCode(toolkit, typedResponse),
          body: await adapter.getResponseBody(toolkit, typedResponse),
        }
        await adapter.respond(toolkit, rawResponse)
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    },
  )
}
