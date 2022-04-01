import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { isNil } from 'lodash'
import { hasInput } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getRequestTypeAst } from '../common/getRequestTypeAst'
import { getCommonImports } from '../common/getCommonImports'
import { requestPropertyFactory } from './requestPropertyFactory'

export function generateRequestType(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeScriptModule {
  if (!hasInput(data, context)) {
    return undefined
  }
  const { pathOf, nameOf } = context
  const { operation } = data
  const path = pathOf(operation, 'openapi/request-type')
  const ast = getRequestTypeAst(nameOf(data.operation, 'openapi/request-type'), data, context, requestPropertyFactory)
  return {
    path,
    dependencies: getCommonImports(path, data, context),
    content: isNil(ast) ? [] : [ast],
  }
}
