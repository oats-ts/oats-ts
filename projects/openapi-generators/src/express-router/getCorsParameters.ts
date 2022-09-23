import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { HttpMethod } from '@oats-ts/openapi-http'
import { isNil } from 'lodash'
import { Expression, factory } from 'typescript'
import { RouterNames } from '../utils/RouterNames'
import { getRequestHeaderNames } from './getRequestHeaderNames'
import { getRequestMethods } from './getRequestMethods'
import { getResponseHeaderNames } from './getResponseHeaderNames'
import { ExpressRoutersGeneratorConfig } from './typings'

const alwaysTrue = () => true

export function getCorsParameters(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRoutersGeneratorConfig,
  isPreflight: boolean,
): Expression[] {
  if (config.cors === false || isNil(config.cors)) {
    return []
  }
  const pathItem = data.parent
  const {
    allowedOrigins,
    isMethodAllowed = alwaysTrue,
    isRequestHeaderAllowed = alwaysTrue,
    isResponseHeaderAllowed = alwaysTrue,
  } = config.cors

  const methods = getRequestMethods(pathItem).filter((method) => isMethodAllowed(data.url, method))

  const requestHeaders = methods.map((method): [HttpMethod, string[]] => [
    method,
    getRequestHeaderNames(pathItem[method], context).filter((header) => isRequestHeaderAllowed(data.url, header)),
  ])

  const responseHeaders = methods.map((method): [HttpMethod, string[]] => [
    method,
    getResponseHeaderNames(pathItem[method], context).filter((header) => isResponseHeaderAllowed(data.url, header)),
  ])

  const toolkitParam = factory.createIdentifier(RouterNames.toolkit)

  const originsParam =
    allowedOrigins === true
      ? factory.createTrue()
      : factory.createArrayLiteralExpression(allowedOrigins.map((origin) => factory.createStringLiteral(origin)))

  const methodsParam = factory.createArrayLiteralExpression(
    methods.map((method) => factory.createStringLiteral(method)),
  )

  const requestHeadersParam = factory.createObjectLiteralExpression(
    requestHeaders.map(([name, headers]) =>
      factory.createPropertyAssignment(
        name,
        factory.createArrayLiteralExpression(headers.map((header) => factory.createStringLiteral(header))),
      ),
    ),
  )

  const responseHeadersParam = factory.createObjectLiteralExpression(
    responseHeaders.map(([name, headers]) =>
      factory.createPropertyAssignment(
        name,
        factory.createArrayLiteralExpression(headers.map((header) => factory.createStringLiteral(header))),
      ),
    ),
  )

  return isPreflight
    ? [toolkitParam, originsParam, methodsParam, requestHeadersParam, responseHeadersParam]
    : [toolkitParam, originsParam]
}
