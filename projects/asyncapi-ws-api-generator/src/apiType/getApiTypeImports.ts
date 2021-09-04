import { flatMap } from 'lodash'
import { AsyncApiObject } from '@oats-ts/asyncapi-model'
import { AsyncAPIGeneratorContext, EnhancedChannel, RuntimePackages } from '@oats-ts/asyncapi-common'
import { ImportDeclaration } from 'typescript'
import { getNamedImports } from '@oats-ts/typescript-common'

export function getApiTypeImports(
  doc: AsyncApiObject,
  operations: EnhancedChannel[],
  context: AsyncAPIGeneratorContext,
  params: boolean,
): ImportDeclaration[] {
  const { dependenciesOf, pathOf } = context
  const apiPath = pathOf(doc, 'asyncapi/type')
  const imports = flatMap(operations, (data) => [
    ...(params ? dependenciesOf(apiPath, data.channel, 'asyncapi/input-type') : []),
    ...dependenciesOf(apiPath, data.channel, 'asyncapi/channel'),
  ])
  return operations.length > 0
    ? [...imports, ...(params ? [getNamedImports(RuntimePackages.Ws.name, [RuntimePackages.Ws.WebsocketConfig])] : [])]
    : imports
}
