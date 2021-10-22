import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { factory, Block } from 'typescript'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { ExpressRouteGeneratorConfig } from '../typings'
import { getConfigurationStatementAst } from './getConfigurationStatementAst'
import { getApiStatementAst } from './getApiStatementAst'
import { getParametersStatementAst } from './getParametersStatementAst'
import { getBodyStatementAst } from './getBodyStatementAst'
import { getApiHandlerCallResultStatementAst } from './getApiHandlerCallResultStatementAst'
import { getResponseBodySetterStatementAst } from './getResponseBodySetterStatementAst'
import { getResponseHeaderSetterStatementAst } from './getResponseHeaderSetterStatementAst'
import { getResponseHeadersStatementAst } from './getResponseHeadersStatementAst'
import { getExpressParamsStatementAst } from './getExpressParamsStatementAst'

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
    getExpressParamsStatementAst(),
    ...getParametersStatementAst('path', data, context),
    ...getParametersStatementAst('query', data, context),
    ...getParametersStatementAst('header', data, context),
    ...getBodyStatementAst(data, context),
    getApiHandlerCallResultStatementAst(data, context),
    getResponseHeadersStatementAst(data, context),
    getResponseBodySetterStatementAst(data, context),
    getResponseHeaderSetterStatementAst(data, context),
  ])
}
