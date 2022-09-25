import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { isNil } from 'lodash'
import { Expression, factory } from 'typescript'
import { RouterNames } from '../../utils/RouterNames'
import { ExpressRoutersGeneratorConfig } from '../typings'
import { getResponseHeaderNames } from './getResponseHeaderNames'
import { defaultIncludeCredentials, defaultMaxAge, defaultResponseHeaderFilter } from './utils'

export function getCorsParameters(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
): Expression[] {
  if (config.cors === false || isNil(config.cors)) {
    return []
  }

  const { url, operation, method } = data

  const {
    allowedOrigins,
    isResponseHeaderAllowed = defaultResponseHeaderFilter,
    allowCredentials: getAllowCreds = defaultIncludeCredentials,
    maxAge: getMaxAge = defaultMaxAge,
  } = config.cors

  const maxAge = getMaxAge(url, method, operation)
  const includeCreds = getAllowCreds(url, method, operation)

  const responseHeaders = getResponseHeaderNames(operation, context).filter((header) =>
    isResponseHeaderAllowed(url, header, operation),
  )

  const toolkitParam = factory.createIdentifier(RouterNames.toolkit)

  const originsExpression =
    allowedOrigins === true
      ? factory.createTrue()
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
    ...(!isNil(maxAge)
      ? [factory.createPropertyAssignment(RouterNames.maxAge, factory.createNumericLiteral(maxAge))]
      : []),
  ])

  return [toolkitParam, configParam]
}
