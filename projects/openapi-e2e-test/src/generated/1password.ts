/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://api.apis.guru/v2/specs/1password.com/events/1.0.0/openapi.json
 */

import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { ClientAdapter, RawHttpRequest, RawHttpResponse, ServerAdapter } from '@oats-ts/openapi-http'
import {
  array,
  boolean,
  combine,
  items,
  lazy,
  literal,
  number,
  object,
  optional,
  shape,
  string,
  union,
} from '@oats-ts/validators'
import { NextFunction, Request, RequestHandler, Response, Router } from 'express'

/**
 * Metadata gathered about the client
 */
export type Client = {
  app_name?: string
  app_version?: string
  ip_address?: string
  os_name?: string
  os_version?: string
  platform_name?: string
  /**
   * Depending on the platform used, this can be the version of the browser that the client extension is installed, the model of computer that the native application is installed or the machine's CPU version that the CLI was installed
   */
  platform_version?: string
}

/**
 * Cursor
 */
export type Cursor = {
  /**
   * Cursor to fetch more data if available or continue the polling process if required
   */
  cursor?: string
}

/**
 * Common cursor properties for collection responses
 */
export type CursorCollection = Cursor & {
  /**
   * Whether there may still be more data to fetch using the returned cursor. If true, the subsequent request could still be empty.
   */
  has_more?: boolean
}

export type DateTimeRFC3339 = string

/**
 * Additional information about the sign-in attempt
 */
export type Details = {
  /**
   * For firewall prevented sign-ins, the value is the chosen continent, country, etc. that blocked the sign-in attempt
   */
  value?: string
}

export type Error = {
  Error?: {
    /**
     * The error message.
     */
    Message?: string
  }
}

export type Introspection = {
  Features?: string[]
  IssuedAt?: DateTimeRFC3339
  UUID?: string
}

/**
 * A single item usage object
 */
export type ItemUsage = {
  client?: Client
  item_uuid?: UUID
  timestamp?: DateTimeRFC3339
  used_version?: number
  user?: User
  uuid?: UUID
  vault_uuid?: UUID
}

/**
 * An object wrapping cursor properties and a list of items usages
 */
export type ItemUsageItems = {
  items?: ItemUsage[]
} & CursorCollection

/**
 * Reset cursor
 */
export type ResetCursor = {
  end_time?: DateTimeRFC3339
  limit?: number
  start_time?: DateTimeRFC3339
}

/**
 * A single sign-in attempt object
 */
export type SignInAttempt = {
  category?:
    | 'success'
    | 'credentials_failed'
    | 'mfa_failed'
    | 'modern_version_failed'
    | 'firewall_failed'
    | 'firewall_reported_success'
  client?: Client
  /**
   * Country ISO Code
   */
  country?: string
  details?: Details
  session_uuid?: UUID
  target_user?: User
  timestamp?: DateTimeRFC3339
  type?:
    | 'credentials_ok'
    | 'mfa_ok'
    | 'password_secret_bad'
    | 'mfa_missing'
    | 'totp_disabled'
    | 'totp_bad'
    | 'totp_timeout'
    | 'u2f_disabled'
    | 'u2f_bad'
    | 'u2f_timout'
    | 'duo_disabled'
    | 'duo_bad'
    | 'duo_timeout'
    | 'duo_native_bad'
    | 'platform_secret_disabled'
    | 'platform_secret_bad'
    | 'platform_secret_proxy'
    | 'code_disabled'
    | 'code_bad'
    | 'code_timeout'
    | 'ip_blocked'
    | 'continent_blocked'
    | 'country_blocked'
    | 'anonymous_blocked'
    | 'all_blocked'
    | 'modern_version_missing'
    | 'modern_version_old'
  uuid?: UUID
}

/**
 * An object wrapping cursor properties and a list of sign-in attempts
 */
export type SignInAttemptItems = {
  items?: SignInAttempt[]
} & CursorCollection

export type UUID = string

/**
 * User object
 */
export type User = {
  email?: string
  /**
   * Full name
   */
  name?: string
  uuid?: UUID
}

export const clientTypeValidator = object(
  shape({
    app_name: optional(string()),
    app_version: optional(string()),
    ip_address: optional(string()),
    os_name: optional(string()),
    os_version: optional(string()),
    platform_name: optional(string()),
    platform_version: optional(string()),
  }),
)

export const cursorCollectionTypeValidator = combine(
  lazy(() => cursorTypeValidator),
  object(shape({ has_more: optional(boolean()) })),
)

export const cursorTypeValidator = object(shape({ cursor: optional(string()) }))

export const dateTimeRfc3339TypeValidator = string()

export const detailsTypeValidator = object(shape({ value: optional(string()) }))

export const errorTypeValidator = object(shape({ Error: optional(object(shape({ Message: optional(string()) }))) }))

export const introspectionTypeValidator = object(
  shape({
    Features: optional(array(items(string()))),
    IssuedAt: optional(lazy(() => dateTimeRfc3339TypeValidator)),
    UUID: optional(string()),
  }),
)

export const itemUsageItemsTypeValidator = combine(
  object(shape({ items: optional(array(items(lazy(() => itemUsageTypeValidator)))) })),
  lazy(() => cursorCollectionTypeValidator),
)

export const itemUsageTypeValidator = object(
  shape({
    client: optional(lazy(() => clientTypeValidator)),
    item_uuid: optional(lazy(() => uuidTypeValidator)),
    timestamp: optional(lazy(() => dateTimeRfc3339TypeValidator)),
    used_version: optional(number()),
    user: optional(lazy(() => userTypeValidator)),
    uuid: optional(lazy(() => uuidTypeValidator)),
    vault_uuid: optional(lazy(() => uuidTypeValidator)),
  }),
)

export const resetCursorTypeValidator = object(
  shape({
    end_time: optional(lazy(() => dateTimeRfc3339TypeValidator)),
    limit: optional(number()),
    start_time: optional(lazy(() => dateTimeRfc3339TypeValidator)),
  }),
)

export const signInAttemptItemsTypeValidator = combine(
  object(shape({ items: optional(array(items(lazy(() => signInAttemptTypeValidator)))) })),
  lazy(() => cursorCollectionTypeValidator),
)

export const signInAttemptTypeValidator = object(
  shape({
    category: optional(
      union({
        success: literal('success'),
        credentials_failed: literal('credentials_failed'),
        mfa_failed: literal('mfa_failed'),
        modern_version_failed: literal('modern_version_failed'),
        firewall_failed: literal('firewall_failed'),
        firewall_reported_success: literal('firewall_reported_success'),
      }),
    ),
    client: optional(lazy(() => clientTypeValidator)),
    country: optional(string()),
    details: optional(lazy(() => detailsTypeValidator)),
    session_uuid: optional(lazy(() => uuidTypeValidator)),
    target_user: optional(lazy(() => userTypeValidator)),
    timestamp: optional(lazy(() => dateTimeRfc3339TypeValidator)),
    type: optional(
      union({
        credentials_ok: literal('credentials_ok'),
        mfa_ok: literal('mfa_ok'),
        password_secret_bad: literal('password_secret_bad'),
        mfa_missing: literal('mfa_missing'),
        totp_disabled: literal('totp_disabled'),
        totp_bad: literal('totp_bad'),
        totp_timeout: literal('totp_timeout'),
        u2f_disabled: literal('u2f_disabled'),
        u2f_bad: literal('u2f_bad'),
        u2f_timout: literal('u2f_timout'),
        duo_disabled: literal('duo_disabled'),
        duo_bad: literal('duo_bad'),
        duo_timeout: literal('duo_timeout'),
        duo_native_bad: literal('duo_native_bad'),
        platform_secret_disabled: literal('platform_secret_disabled'),
        platform_secret_bad: literal('platform_secret_bad'),
        platform_secret_proxy: literal('platform_secret_proxy'),
        code_disabled: literal('code_disabled'),
        code_bad: literal('code_bad'),
        code_timeout: literal('code_timeout'),
        ip_blocked: literal('ip_blocked'),
        continent_blocked: literal('continent_blocked'),
        country_blocked: literal('country_blocked'),
        anonymous_blocked: literal('anonymous_blocked'),
        all_blocked: literal('all_blocked'),
        modern_version_missing: literal('modern_version_missing'),
        modern_version_old: literal('modern_version_old'),
      }),
    ),
    uuid: optional(lazy(() => uuidTypeValidator)),
  }),
)

export const userTypeValidator = object(
  shape({
    email: optional(string()),
    name: optional(string()),
    uuid: optional(lazy(() => uuidTypeValidator)),
  }),
)

export const uuidTypeValidator = string()

export function isClient(input: any): input is Client {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.app_name === null || input.app_name === undefined || typeof input.app_name === 'string') &&
    (input.app_version === null || input.app_version === undefined || typeof input.app_version === 'string') &&
    (input.ip_address === null || input.ip_address === undefined || typeof input.ip_address === 'string') &&
    (input.os_name === null || input.os_name === undefined || typeof input.os_name === 'string') &&
    (input.os_version === null || input.os_version === undefined || typeof input.os_version === 'string') &&
    (input.platform_name === null || input.platform_name === undefined || typeof input.platform_name === 'string') &&
    (input.platform_version === null ||
      input.platform_version === undefined ||
      typeof input.platform_version === 'string')
  )
}

export function isCursor(input: any): input is Cursor {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.cursor === null || input.cursor === undefined || typeof input.cursor === 'string')
  )
}

export function isCursorCollection(input: any): input is CursorCollection {
  return (
    (isCursor(input) as boolean) &&
    input !== null &&
    typeof input === 'object' &&
    (input.has_more === null || input.has_more === undefined || typeof input.has_more === 'boolean')
  )
}

export function isDateTimeRfc3339(input: any): input is DateTimeRFC3339 {
  return typeof input === 'string'
}

export function isDetails(input: any): input is Details {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.value === null || input.value === undefined || typeof input.value === 'string')
  )
}

export function isError(input: any): input is Error {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.Error === null ||
      input.Error === undefined ||
      (input.Error !== null &&
        typeof input.Error === 'object' &&
        (input.Error.Message === null || input.Error.Message === undefined || typeof input.Error.Message === 'string')))
  )
}

export function isIntrospection(input: any): input is Introspection {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.Features === null ||
      input.Features === undefined ||
      (Array.isArray(input.Features) && input.Features.every((item: any) => typeof item === 'string'))) &&
    (input.IssuedAt === null || input.IssuedAt === undefined || (isDateTimeRfc3339(input.IssuedAt) as boolean)) &&
    (input.UUID === null || input.UUID === undefined || typeof input.UUID === 'string')
  )
}

export function isItemUsage(input: any): input is ItemUsage {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.client === null || input.client === undefined || (isClient(input.client) as boolean)) &&
    (input.item_uuid === null || input.item_uuid === undefined || (isUuid(input.item_uuid) as boolean)) &&
    (input.timestamp === null || input.timestamp === undefined || (isDateTimeRfc3339(input.timestamp) as boolean)) &&
    (input.used_version === null || input.used_version === undefined || typeof input.used_version === 'number') &&
    (input.user === null || input.user === undefined || (isUser(input.user) as boolean)) &&
    (input.uuid === null || input.uuid === undefined || (isUuid(input.uuid) as boolean)) &&
    (input.vault_uuid === null || input.vault_uuid === undefined || (isUuid(input.vault_uuid) as boolean))
  )
}

export function isItemUsageItems(input: any): input is ItemUsageItems {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.items === null ||
      input.items === undefined ||
      (Array.isArray(input.items) && input.items.every((item: any) => isItemUsage(item) as boolean))) &&
    (isCursorCollection(input) as boolean)
  )
}

export function isResetCursor(input: any): input is ResetCursor {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.end_time === null || input.end_time === undefined || (isDateTimeRfc3339(input.end_time) as boolean)) &&
    (input.limit === null || input.limit === undefined || typeof input.limit === 'number') &&
    (input.start_time === null || input.start_time === undefined || (isDateTimeRfc3339(input.start_time) as boolean))
  )
}

export function isSignInAttempt(input: any): input is SignInAttempt {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.category === null ||
      input.category === undefined ||
      input.category === 'success' ||
      input.category === 'credentials_failed' ||
      input.category === 'mfa_failed' ||
      input.category === 'modern_version_failed' ||
      input.category === 'firewall_failed' ||
      input.category === 'firewall_reported_success') &&
    (input.client === null || input.client === undefined || (isClient(input.client) as boolean)) &&
    (input.country === null || input.country === undefined || typeof input.country === 'string') &&
    (input.details === null || input.details === undefined || (isDetails(input.details) as boolean)) &&
    (input.session_uuid === null || input.session_uuid === undefined || (isUuid(input.session_uuid) as boolean)) &&
    (input.target_user === null || input.target_user === undefined || (isUser(input.target_user) as boolean)) &&
    (input.timestamp === null || input.timestamp === undefined || (isDateTimeRfc3339(input.timestamp) as boolean)) &&
    (input.type === null ||
      input.type === undefined ||
      input.type === 'credentials_ok' ||
      input.type === 'mfa_ok' ||
      input.type === 'password_secret_bad' ||
      input.type === 'mfa_missing' ||
      input.type === 'totp_disabled' ||
      input.type === 'totp_bad' ||
      input.type === 'totp_timeout' ||
      input.type === 'u2f_disabled' ||
      input.type === 'u2f_bad' ||
      input.type === 'u2f_timout' ||
      input.type === 'duo_disabled' ||
      input.type === 'duo_bad' ||
      input.type === 'duo_timeout' ||
      input.type === 'duo_native_bad' ||
      input.type === 'platform_secret_disabled' ||
      input.type === 'platform_secret_bad' ||
      input.type === 'platform_secret_proxy' ||
      input.type === 'code_disabled' ||
      input.type === 'code_bad' ||
      input.type === 'code_timeout' ||
      input.type === 'ip_blocked' ||
      input.type === 'continent_blocked' ||
      input.type === 'country_blocked' ||
      input.type === 'anonymous_blocked' ||
      input.type === 'all_blocked' ||
      input.type === 'modern_version_missing' ||
      input.type === 'modern_version_old') &&
    (input.uuid === null || input.uuid === undefined || (isUuid(input.uuid) as boolean))
  )
}

export function isSignInAttemptItems(input: any): input is SignInAttemptItems {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.items === null ||
      input.items === undefined ||
      (Array.isArray(input.items) && input.items.every((item: any) => isSignInAttempt(item) as boolean))) &&
    (isCursorCollection(input) as boolean)
  )
}

export function isUser(input: any): input is User {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.email === null || input.email === undefined || typeof input.email === 'string') &&
    (input.name === null || input.name === undefined || typeof input.name === 'string') &&
    (input.uuid === null || input.uuid === undefined || (isUuid(input.uuid) as boolean))
  )
}

export function isUuid(input: any): input is UUID {
  return typeof input === 'string'
}

export type GetAuthIntrospectServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: Introspection
    }
  | {
      statusCode: 401
      mimeType: 'application/json'
      body: Error
    }
  | {
      statusCode: Exclude<number, 200 | 401>
      mimeType: 'application/json'
      body: Error
    }

export type GetItemUsagesServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: ItemUsageItems
    }
  | {
      statusCode: 401
      mimeType: 'application/json'
      body: Error
    }
  | {
      statusCode: Exclude<number, 200 | 401>
      mimeType: 'application/json'
      body: Error
    }

export type GetSignInAttemptsServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: SignInAttemptItems
    }
  | {
      statusCode: 401
      mimeType: 'application/json'
      body: Error
    }
  | {
      statusCode: Exclude<number, 200 | 401>
      mimeType: 'application/json'
      body: Error
    }

export type EventsAPIApi = {
  /**
   * Performs introspection of the provided Bearer JWT token
   */
  getAuthIntrospect(): Promise<GetAuthIntrospectServerResponse>
  /**
   * Retrieves item usages
   *
   * This endpoint requires your JSON Web Token to have the *itemusages* feature.
   */
  getItemUsages(): Promise<GetItemUsagesServerResponse>
  /**
   * Retrieves sign-in attempts
   *
   * This endpoint requires your JSON Web Token to have the *signinattempts* feature.
   */
  getSignInAttempts(): Promise<GetSignInAttemptsServerResponse>
}

export const getAuthIntrospectRouter: Router = Router().get(
  '/api/auth/introspect',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const toolkit: ExpressToolkit = { request, response, next }
    const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter']
    const api: EventsAPIApi = response.locals['__oats_api']
    try {
      const typedResponse = await api.getAuthIntrospect()
      const rawResponse: RawHttpResponse = {
        headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined),
        statusCode: await adapter.getStatusCode(toolkit, typedResponse),
        body: await adapter.getResponseBody(toolkit, typedResponse),
        cookies: await adapter.getResponseCookies(toolkit, typedResponse, undefined),
      }
      return adapter.respond(toolkit, rawResponse)
    } catch (error) {
      adapter.handleError(toolkit, error)
    }
  },
)

export const getItemUsagesRouter: Router = Router().post(
  '/api/v1/itemusages',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const toolkit: ExpressToolkit = { request, response, next }
    const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter']
    const api: EventsAPIApi = response.locals['__oats_api']
    try {
      const typedResponse = await api.getItemUsages()
      const rawResponse: RawHttpResponse = {
        headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined),
        statusCode: await adapter.getStatusCode(toolkit, typedResponse),
        body: await adapter.getResponseBody(toolkit, typedResponse),
        cookies: await adapter.getResponseCookies(toolkit, typedResponse, undefined),
      }
      return adapter.respond(toolkit, rawResponse)
    } catch (error) {
      adapter.handleError(toolkit, error)
    }
  },
)

export const getSignInAttemptsRouter: Router = Router().post(
  '/api/v1/signinattempts',
  async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const toolkit: ExpressToolkit = { request, response, next }
    const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter']
    const api: EventsAPIApi = response.locals['__oats_api']
    try {
      const typedResponse = await api.getSignInAttempts()
      const rawResponse: RawHttpResponse = {
        headers: await adapter.getResponseHeaders(toolkit, typedResponse, undefined),
        statusCode: await adapter.getStatusCode(toolkit, typedResponse),
        body: await adapter.getResponseBody(toolkit, typedResponse),
        cookies: await adapter.getResponseCookies(toolkit, typedResponse, undefined),
      }
      return adapter.respond(toolkit, rawResponse)
    } catch (error) {
      adapter.handleError(toolkit, error)
    }
  },
)

export type EventsAPIRouters = {
  getAuthIntrospectRouter: Router
  getItemUsagesRouter: Router
  getSignInAttemptsRouter: Router
}

export function createEventsAPIRouter(
  api: EventsAPIApi,
  adapter: ServerAdapter<ExpressToolkit>,
  routes: Partial<EventsAPIRouters> = {},
): Router {
  return Router().use(
    (_, response, next) => {
      response.locals['__oats_api'] = api
      response.locals['__oats_adapter'] = adapter
      next()
    },
    routes.getAuthIntrospectRouter ?? getAuthIntrospectRouter,
    routes.getItemUsagesRouter ?? getItemUsagesRouter,
    routes.getSignInAttemptsRouter ?? getSignInAttemptsRouter,
  )
}

export const eventsApiCorsMiddleware: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
  response.setHeader('Access-Control-Allow-Origin', request.header('origin') ?? '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  response.setHeader('Access-Control-Allow-Headers', 'content-type')
  response.setHeader('Access-Control-Expose-Headers', 'content-type')
  next()
}

export type GetAuthIntrospectResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: Introspection
    }
  | {
      statusCode: 401
      mimeType: 'application/json'
      body: Error
    }
  | {
      statusCode: Exclude<number, 200 | 401>
      mimeType: 'application/json'
      body: Error
    }

export type GetItemUsagesResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: ItemUsageItems
    }
  | {
      statusCode: 401
      mimeType: 'application/json'
      body: Error
    }
  | {
      statusCode: Exclude<number, 200 | 401>
      mimeType: 'application/json'
      body: Error
    }

export type GetSignInAttemptsResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: SignInAttemptItems
    }
  | {
      statusCode: 401
      mimeType: 'application/json'
      body: Error
    }
  | {
      statusCode: Exclude<number, 200 | 401>
      mimeType: 'application/json'
      body: Error
    }

export const getAuthIntrospectResponseBodyValidator = {
  200: { 'application/json': introspectionTypeValidator },
  401: { 'application/json': errorTypeValidator },
  default: { 'application/json': errorTypeValidator },
} as const

export const getItemUsagesResponseBodyValidator = {
  200: { 'application/json': itemUsageItemsTypeValidator },
  401: { 'application/json': errorTypeValidator },
  default: { 'application/json': errorTypeValidator },
} as const

export const getSignInAttemptsResponseBodyValidator = {
  200: { 'application/json': signInAttemptItemsTypeValidator },
  401: { 'application/json': errorTypeValidator },
  default: { 'application/json': errorTypeValidator },
} as const

/**
 * Performs introspection of the provided Bearer JWT token
 */
export async function getAuthIntrospect(adapter: ClientAdapter): Promise<GetAuthIntrospectResponse> {
  const requestUrl = await adapter.getUrl('/api/auth/introspect', undefined)
  const requestHeaders = await adapter.getRequestHeaders(undefined, undefined, undefined, undefined)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'get',
    headers: requestHeaders,
  }
  const rawResponse = await adapter.request(rawRequest)
  const mimeType = await adapter.getMimeType(rawResponse)
  const statusCode = await adapter.getStatusCode(rawResponse)
  const responseBody = await adapter.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    getAuthIntrospectResponseBodyValidator,
  )
  return {
    mimeType,
    statusCode,
    body: responseBody,
  } as GetAuthIntrospectResponse
}

/**
 * Retrieves item usages
 *
 * This endpoint requires your JSON Web Token to have the *itemusages* feature.
 */
export async function getItemUsages(adapter: ClientAdapter): Promise<GetItemUsagesResponse> {
  const requestUrl = await adapter.getUrl('/api/v1/itemusages', undefined)
  const requestHeaders = await adapter.getRequestHeaders(undefined, undefined, undefined, undefined)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    headers: requestHeaders,
  }
  const rawResponse = await adapter.request(rawRequest)
  const mimeType = await adapter.getMimeType(rawResponse)
  const statusCode = await adapter.getStatusCode(rawResponse)
  const responseBody = await adapter.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    getItemUsagesResponseBodyValidator,
  )
  return {
    mimeType,
    statusCode,
    body: responseBody,
  } as GetItemUsagesResponse
}

/**
 * Retrieves sign-in attempts
 *
 * This endpoint requires your JSON Web Token to have the *signinattempts* feature.
 */
export async function getSignInAttempts(adapter: ClientAdapter): Promise<GetSignInAttemptsResponse> {
  const requestUrl = await adapter.getUrl('/api/v1/signinattempts', undefined)
  const requestHeaders = await adapter.getRequestHeaders(undefined, undefined, undefined, undefined)
  const rawRequest: RawHttpRequest = {
    url: requestUrl,
    method: 'post',
    headers: requestHeaders,
  }
  const rawResponse = await adapter.request(rawRequest)
  const mimeType = await adapter.getMimeType(rawResponse)
  const statusCode = await adapter.getStatusCode(rawResponse)
  const responseBody = await adapter.getResponseBody(
    rawResponse,
    statusCode,
    mimeType,
    getSignInAttemptsResponseBodyValidator,
  )
  return {
    mimeType,
    statusCode,
    body: responseBody,
  } as GetSignInAttemptsResponse
}

export type EventsAPISdk = {
  /**
   * Performs introspection of the provided Bearer JWT token
   */
  getAuthIntrospect(): Promise<GetAuthIntrospectResponse>
  /**
   * Retrieves item usages
   *
   * This endpoint requires your JSON Web Token to have the *itemusages* feature.
   */
  getItemUsages(): Promise<GetItemUsagesResponse>
  /**
   * Retrieves sign-in attempts
   *
   * This endpoint requires your JSON Web Token to have the *signinattempts* feature.
   */
  getSignInAttempts(): Promise<GetSignInAttemptsResponse>
}

export class EventsAPISdkImpl implements EventsAPISdk {
  protected readonly adapter: ClientAdapter
  public constructor(adapter: ClientAdapter) {
    this.adapter = adapter
  }
  public async getAuthIntrospect(): Promise<GetAuthIntrospectResponse> {
    return getAuthIntrospect(this.adapter)
  }
  public async getItemUsages(): Promise<GetItemUsagesResponse> {
    return getItemUsages(this.adapter)
  }
  public async getSignInAttempts(): Promise<GetSignInAttemptsResponse> {
    return getSignInAttempts(this.adapter)
  }
}
