import { AsyncApiObject } from '@oats-ts/asyncapi-model'
import { EnhancedChannel } from '@oats-ts/asyncapi-common'
import { RuntimePackages, AsyncAPIGeneratorContext } from '@oats-ts/asyncapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getApiTypeImports } from '../apiType/getApiTypeImports'
import { getApiClassAst } from './getApiClassAst'
import { ApiGeneratorConfig } from '../types'
import { flatMap } from 'lodash'
import { getNamedImports } from '@oats-ts/typescript-common'

export function generateApiClass(
  doc: AsyncApiObject,
  operations: EnhancedChannel[],
  context: AsyncAPIGeneratorContext,
  config: ApiGeneratorConfig,
): TypeScriptModule {
  const { dependenciesOf, pathOf } = context
  const path = pathOf(doc, 'asyncapi/api-class')
  return {
    path,
    dependencies: [
      getNamedImports(RuntimePackages.Ws.name, [RuntimePackages.Ws.WebsocketConfig]),
      ...getApiTypeImports(doc, operations, context, true),
      ...dependenciesOf(path, doc, 'asyncapi/api-type'),
      ...flatMap(operations, ({ channel }) => dependenciesOf(path, channel, 'asyncapi/channel-factory')),
    ],
    content: [getApiClassAst(doc, operations, context, config)],
  }
}
