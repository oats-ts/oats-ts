import { AsyncApiObject } from '@oats-ts/asyncapi-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedChannel } from '@oats-ts/asyncapi-common'
import { getApiTypeImports } from '../apiType/getApiTypeImports'
import { RuntimePackages, AsyncAPIGeneratorContext } from '@oats-ts/asyncapi-common'
import { getApiStubAst } from './getApiStubAst'
import { ApiGeneratorConfig } from '../types'
import { getNamedImports } from '@oats-ts/typescript-common'

export function generateApiStub(
  doc: AsyncApiObject,
  operations: EnhancedChannel[],
  context: AsyncAPIGeneratorContext,
  config: ApiGeneratorConfig,
): TypeScriptModule {
  const { dependenciesOf, pathOf } = context
  const path = pathOf(doc, 'asyncapi/api-stub')
  return {
    path,
    dependencies: [
      ...(operations.length === 0
        ? []
        : [getNamedImports(RuntimePackages.Ws.name, [RuntimePackages.Ws.WebsocketConfig])]),
      ...getApiTypeImports(doc, operations, context),
      ...dependenciesOf(path, doc, 'asyncapi/api-type'),
    ],
    content: [getApiStubAst(doc, operations, context, config)],
  }
}