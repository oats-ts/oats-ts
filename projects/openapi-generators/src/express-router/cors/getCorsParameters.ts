import { isNil } from 'lodash'
import { Expression, factory } from 'typescript'
import { RouterNames } from '../../utils/RouterNames'
import { ExpressRoutersGeneratorConfig } from '../typings'

export function getCorsParameters(config: ExpressRoutersGeneratorConfig): Expression[] {
  if (config.cors === false || isNil(config.cors)) {
    return []
  }
  const { allowedOrigins } = config.cors

  const toolkitParam = factory.createIdentifier(RouterNames.toolkit)

  const originsParam =
    allowedOrigins === true
      ? factory.createTrue()
      : factory.createArrayLiteralExpression(allowedOrigins.map((origin) => factory.createStringLiteral(origin)))

  return [toolkitParam, originsParam]
}
