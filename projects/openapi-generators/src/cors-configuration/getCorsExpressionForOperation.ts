import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { isNil } from 'lodash'
import { Expression, factory } from 'typescript'
import { getRequestHeaderNames } from '../utils/express/getRequestHeaderNames'
import { getResponseHeaderNames } from '../utils/express/getResponseHeaderNames'
import { RouterNames } from '../utils/express/RouterNames'
import { CorsConfigurationGeneratorConfig } from './typings'

export function getCorsExpressionForOperation(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: CorsConfigurationGeneratorConfig,
): Expression | undefined {
  const { url, operation, method } = data

  const { getAllowedOrigins, isResponseHeaderAllowed, isRequestHeaderAllowed, isCredentialsAllowed, getMaxAge } = config
  const allowedOrigins = getAllowedOrigins(url, method, operation)
  if (allowedOrigins === false || (Array.isArray(allowedOrigins) && allowedOrigins.length === 0)) {
    return undefined
  }
  const credentials = isCredentialsAllowed(url, method, operation)
  const maxAge = getMaxAge(url, method, operation)

  const responseHeaders = getResponseHeaderNames(operation, context).filter((header) =>
    isResponseHeaderAllowed(header, url, method, operation),
  )

  const requestHeaders = getRequestHeaderNames(operation, context).filter((header) =>
    isRequestHeaderAllowed(header, url, method, operation),
  )

  const originsExpression =
    typeof allowedOrigins === 'boolean'
      ? allowedOrigins === true
        ? factory.createTrue()
        : factory.createFalse()
      : factory.createArrayLiteralExpression(allowedOrigins.map((origin) => factory.createStringLiteral(origin)))

  const responseHeadersExpression = factory.createArrayLiteralExpression(
    responseHeaders.map((header) => factory.createStringLiteral(header)),
  )

  const requestHeadersExpression = factory.createArrayLiteralExpression(
    requestHeaders.map((header) => factory.createStringLiteral(header)),
  )

  return factory.createObjectLiteralExpression(
    [
      factory.createPropertyAssignment(RouterNames.allowedOrigins, originsExpression),
      ...(requestHeaders.length > 0
        ? [factory.createPropertyAssignment(RouterNames.allowedRequestHeaders, requestHeadersExpression)]
        : []),
      ...(responseHeaders.length > 0
        ? [factory.createPropertyAssignment(RouterNames.allowedResponseHeaders, responseHeadersExpression)]
        : []),
      ...(!isNil(credentials) && typeof credentials === 'number'
        ? [
            factory.createPropertyAssignment(
              RouterNames.allowCredentials,
              credentials ? factory.createTrue() : factory.createFalse(),
            ),
          ]
        : []),
      ...(!isNil(maxAge) && typeof maxAge === 'number'
        ? [factory.createPropertyAssignment(RouterNames.maxAge, factory.createNumericLiteral(maxAge))]
        : []),
    ],
    true,
  )
}
