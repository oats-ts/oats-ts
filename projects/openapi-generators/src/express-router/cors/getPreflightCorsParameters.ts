import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { HttpMethod } from '@oats-ts/openapi-http'
import { isNil } from 'lodash'
import { Expression, factory } from 'typescript'
import { RouterNames } from '../../utils/RouterNames'
import { getRequestHeaderNames } from './getRequestHeaderNames'
import { getRequestMethods } from '../getRequestMethods'
import { ExpressRoutersGeneratorConfig } from '../typings'
import {
  defaultIncludeCredentials,
  defaultIsMethodAllowed,
  defaultMaxAge,
  defaultRequestHeaderFilter,
  defaultResponseHeaderFilter,
} from './utils'
import { getResponseHeaderNames } from './getResponseHeaderNames'

export function getPreflightCorsParameters(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
): Expression[] {
  if (config.cors === false || isNil(config.cors)) {
    return []
  }
  const { operation, parent, url } = data
  const {
    allowedOrigins,
    isMethodAllowed = defaultIsMethodAllowed,
    isRequestHeaderAllowed = defaultRequestHeaderFilter,
    isResponseHeaderAllowed = defaultResponseHeaderFilter,
    allowCredentials: getIncludeCreds = defaultIncludeCredentials,
    maxAge: getMaxAge = defaultMaxAge,
  } = config.cors

  const methods = getRequestMethods(parent).filter((method) => isMethodAllowed(url, method, operation))

  const requestHeaders = methods
    .map((method): [HttpMethod, string[]] => [
      method,
      getRequestHeaderNames(parent[method], context).filter((header) => isRequestHeaderAllowed(url, header, operation)),
    ])
    .filter(([, headers]) => headers.length > 0)

  const responseHeaders = methods
    .map((method): [HttpMethod, string[]] => [
      method,
      getResponseHeaderNames(parent[method], context).filter((header) =>
        isResponseHeaderAllowed(url, header, operation),
      ),
    ])
    .filter(([, headers]) => headers.length > 0)

  const maxAge = methods
    .map((method): [HttpMethod, number | undefined] => [method, getMaxAge(url, method, operation)])
    .filter(([, age]) => !isNil(age))

  const includeCreds = methods
    .map((method): [HttpMethod, boolean | undefined] => [method, getIncludeCreds(url, method, operation)])
    .filter(([, incl]) => !isNil(incl))

  const toolkitParam = factory.createIdentifier(RouterNames.toolkit)

  const originsExpression =
    allowedOrigins === true
      ? factory.createTrue()
      : factory.createArrayLiteralExpression(allowedOrigins.map((origin) => factory.createStringLiteral(origin)))

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
