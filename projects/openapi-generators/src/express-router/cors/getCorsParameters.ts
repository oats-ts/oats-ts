import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { isNil } from 'lodash'
import { Expression, factory } from 'typescript'
import { RouterNames } from '../../utils/RouterNames'
import { ExpressRoutersGeneratorConfig } from '../typings'
import { getResponseHeaderNames } from './getResponseHeaderNames'
import { alwaysTrue } from './utils'

export function getCorsParameters(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
): Expression[] {
  if (config.cors === false || isNil(config.cors)) {
    return []
  }
  const { allowedOrigins, isResponseHeaderAllowed = alwaysTrue } = config.cors

  const responseHeaders = getResponseHeaderNames(data.operation, context).filter((header) =>
    isResponseHeaderAllowed(data.url, header, data.operation),
  )

  const toolkitParam = factory.createIdentifier(RouterNames.toolkit)

  const originsParam =
    allowedOrigins === true
      ? factory.createTrue()
      : factory.createArrayLiteralExpression(allowedOrigins.map((origin) => factory.createStringLiteral(origin)))

  const responseHeadersParam = factory.createArrayLiteralExpression(
    responseHeaders.map((header) => factory.createStringLiteral(header)),
  )

  return [toolkitParam, originsParam, responseHeadersParam]
}
