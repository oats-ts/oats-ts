import { EnhancedPathItem, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { HttpMethod } from '@oats-ts/openapi-http'
import { flatMap, isNil } from 'lodash'
import { Expression, factory } from 'typescript'
import { RouterNames } from '../utils/RouterNames'
import { getRequestHeaderNames } from '../express-router/cors/getRequestHeaderNames'
import { getResponseHeaderNames } from '../express-router/cors/getResponseHeaderNames'
import { ExpressCorsMiddlewareGeneratorConfig } from './typings'

export function getPreflightCorsParameters(
  data: EnhancedPathItem,
  context: OpenAPIGeneratorContext,
  config: ExpressCorsMiddlewareGeneratorConfig,
): Expression[] {
  const { operations, url } = data
  const {
    getAllowedOrigins,
    isMethodAllowed,
    isRequestHeaderAllowed,
    isResponseHeaderAllowed,
    isCredentialsAllowed,
    getMaxAge,
  } = config

  const methods = flatMap(operations, ({ operation, method }) =>
    isMethodAllowed(url, method, operation) ? [method] : [],
  )

  const allowedOrigins = operations
    .map(({ method, operation }): [HttpMethod, boolean | string[]] => [
      method,
      getAllowedOrigins(url, method, operation),
    ])
    .filter(([, origins]) => (Array.isArray(origins) && origins.length > 0) || origins === true)

  const requestHeaders = operations
    .map(({ method, operation }): [HttpMethod, string[]] => [
      method,
      getRequestHeaderNames(operation, context).filter((header) => isRequestHeaderAllowed(url, header, operation)),
    ])
    .filter(([, headers]) => headers.length > 0)

  const responseHeaders = operations
    .map(({ method, operation }): [HttpMethod, string[]] => [
      method,
      getResponseHeaderNames(operation, context).filter((header) => isResponseHeaderAllowed(url, header, operation)),
    ])
    .filter(([, headers]) => headers.length > 0)

  const maxAge = operations
    .map(({ method, operation }): [HttpMethod, number | undefined] => [method, getMaxAge(url, method, operation)])
    .filter(([, age]) => !isNil(age))

  const includeCreds = operations
    .map(({ method, operation }): [HttpMethod, boolean | undefined] => [
      method,
      isCredentialsAllowed(url, method, operation),
    ])
    .filter(([, incl]) => !isNil(incl))

  const toolkitParam = factory.createIdentifier(RouterNames.toolkit)

  const originsExpression = factory.createObjectLiteralExpression(
    allowedOrigins.map(([method, origins]) =>
      factory.createPropertyAssignment(
        method,
        typeof origins === 'boolean'
          ? origins === true
            ? factory.createTrue()
            : factory.createFalse()
          : factory.createArrayLiteralExpression(origins.map((header) => factory.createStringLiteral(header))),
      ),
    ),
  )

  const methodsExpression = factory.createArrayLiteralExpression(
    methods.map((method) => factory.createStringLiteral(method)),
  )

  const requestHeadersExpression = factory.createObjectLiteralExpression(
    requestHeaders.map(([method, headers]) =>
      factory.createPropertyAssignment(
        method,
        factory.createArrayLiteralExpression(headers.map((header) => factory.createStringLiteral(header))),
      ),
    ),
  )

  const responseHeadersExpression = factory.createObjectLiteralExpression(
    responseHeaders.map(([method, headers]) =>
      factory.createPropertyAssignment(
        method,
        factory.createArrayLiteralExpression(headers.map((header) => factory.createStringLiteral(header))),
      ),
    ),
  )

  const includeCredsExpression = factory.createObjectLiteralExpression(
    includeCreds.map(([method, inc]) =>
      factory.createPropertyAssignment(method, inc ? factory.createTrue() : factory.createFalse()),
    ),
  )

  const maxAgeExpression = factory.createObjectLiteralExpression(
    maxAge.map(([method, age]) => factory.createPropertyAssignment(method, factory.createNumericLiteral(age!))),
  )

  const configParam = factory.createObjectLiteralExpression([
    factory.createPropertyAssignment(RouterNames.allowedOrigins, originsExpression),
    ...(methods.length > 0 ? [factory.createPropertyAssignment(RouterNames.allowedMethods, methodsExpression)] : []),
    ...(requestHeaders.length > 0
      ? [factory.createPropertyAssignment(RouterNames.allowedRequestHeaders, requestHeadersExpression)]
      : []),
    ...(responseHeaders.length > 0
      ? [factory.createPropertyAssignment(RouterNames.allowedResponseHeaders, responseHeadersExpression)]
      : []),
    ...(includeCreds.length > 0
      ? [factory.createPropertyAssignment(RouterNames.allowCredentials, includeCredsExpression)]
      : []),
    ...(maxAge.length > 0 ? [factory.createPropertyAssignment(RouterNames.maxAge, maxAgeExpression)] : []),
  ])

  return [toolkitParam, configParam]
}
