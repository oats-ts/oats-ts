import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { isNil } from 'lodash'
import { hasInput, RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getRequestTypeAst } from '../common/getRequestTypeAst'
import { getCommonImports } from '../common/getCommonImports'
import { factory, TypeNode } from 'typescript'
import { getNamedImports } from '@oats-ts/typescript-common'
import { serverRequestPropertyFactory } from './serverRequestPropertyFactory'

function wrapInTry(type: TypeNode): TypeNode {
  return factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Try.Try), [type])
}

export function generateRequestServerType(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeScriptModule {
  if (!hasInput(data, context)) {
    return undefined
  }
  const { pathOf, nameOf } = context
  const { operation } = data
  const path = pathOf(operation, 'openapi/request-server-type')
  const ast = getRequestTypeAst(
    nameOf(data.operation, 'openapi/request-server-type'),
    data,
    context,
    serverRequestPropertyFactory,
  )
  return {
    path,
    dependencies: [
      getNamedImports(RuntimePackages.Try.name, [RuntimePackages.Try.Try]),
      ...getCommonImports(path, data, context),
    ],
    content: isNil(ast) ? [] : [ast],
  }
}
