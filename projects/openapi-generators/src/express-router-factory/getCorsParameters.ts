import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { isNil } from 'lodash'
import { Expression, factory } from 'typescript'
import { getResponseHeaderNames } from '../utils/express/getResponseHeaderNames'
import { RouterNames } from '../utils/express/RouterNames'
import { ExpressRouterFactoriesGeneratorConfig } from './typings'

export function getCorsParameters(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRouterFactoriesGeneratorConfig,
): Expression[] {
  const { url, operation, method } = data

  const { getAllowedOrigins, isResponseHeaderAllowed, isCredentialsAllowed } = config
  const allowedOrigins = getAllowedOrigins(url, method, operation)
  if (allowedOrigins === false || (Array.isArray(allowedOrigins) && allowedOrigins.length === 0)) {
    return []
  }
  const includeCreds = isCredentialsAllowed(url, method, operation)

  const responseHeaders = getResponseHeaderNames(operation, context).filter((header) =>
    isResponseHeaderAllowed(url, header, operation),
  )

  const toolkitParam = factory.createIdentifier(RouterNames.toolkit)

  const originsExpression =
    typeof allowedOrigins === 'boolean'
      ? allowedOrigins === true
        ? factory.createTrue()
        : factory.createFalse()
      : factory.createArrayLiteralExpression(allowedOrigins.map((origin) => factory.createStringLiteral(origin)))

  const responseHeadersExpression = factory.createArrayLiteralExpression(
    responseHeaders.map((header) => factory.createStringLiteral(header)),
  )

  const configParam = factory.createObjectLiteralExpression([
    factory.createPropertyAssignment(RouterNames.allowedOrigins, originsExpression),
    ...(responseHeaders.length > 0
      ? [factory.createPropertyAssignment(RouterNames.allowedResponseHeaders, responseHeadersExpression)]
      : []),
    ...(!isNil(includeCreds)
      ? [
          factory.createPropertyAssignment(
            RouterNames.allowCredentials,
            includeCreds ? factory.createTrue() : factory.createFalse(),
          ),
        ]
      : []),
  ])

  return [toolkitParam, configParam]
}
