import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, Block } from 'typescript'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { ExpressRouteGeneratorConfig } from '../typings'
import { getConfigurationStatementAst } from './getConfigurationStatementAst'
import { getApiStatementAst } from './getApiStatementAst'
import { getParametersStatementAst } from './getParametersStatementAst'
import { getBodyStatementAst } from './getBodyStatementAst'
import { getApiHandlerCallResultStatementAst } from './getApiHandlerCallResultStatementAst'

export function getExpressRouteHandlerBodyAst(
  doc: OpenAPIObject,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ExpressRouteGeneratorConfig,
): Block {
  const { nameOf } = context
  return factory.createBlock([
    getConfigurationStatementAst(config.configurationKey),
    getApiStatementAst(nameOf(doc, 'openapi/api-type'), config.apiImplKey),
    // getExpressParamsStatementAst(),
    ...getParametersStatementAst('path', data, context),
    ...getParametersStatementAst('query', data, context),
    ...getParametersStatementAst('header', data, context),
    ...getBodyStatementAst(data, context),
    getApiHandlerCallResultStatementAst(data, context),
  ])
}
