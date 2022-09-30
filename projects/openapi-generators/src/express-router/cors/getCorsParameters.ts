import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { isNil } from 'lodash'
import { Expression, factory } from 'typescript'
import { RouterNames } from '../../utils/RouterNames'
import { ExpressRoutersGeneratorConfig } from '../typings'
import { getResponseHeaderNames } from './getResponseHeaderNames'

export function getCorsParameters(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
): Expression[] {
  const { url, operation, method } = data

  const {
    getAllowedOrigins = () => false,
    isResponseHeaderAllowed = (_, header) => header !== 'set-cookie',
    isCredentialsAllowed = () => undefined,
  } = config
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
