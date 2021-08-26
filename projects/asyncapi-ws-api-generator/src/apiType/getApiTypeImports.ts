import { flatMap } from 'lodash'
import { AsyncApiObject } from '@oats-ts/asyncapi-model'
import { AsyncAPIGeneratorContext, EnhancedChannel, RuntimePackages } from '@oats-ts/asyncapi-common'
import { ImportDeclaration } from 'typescript'
import { getNamedImports } from '@oats-ts/typescript-common'

export function getApiTypeImports(
  doc: AsyncApiObject,
  operations: EnhancedChannel[],
  context: AsyncAPIGeneratorContext,
): ImportDeclaration[] {
  const { dependenciesOf, pathOf } = context
  const apiPath = pathOf(doc, 'asyncapi/type')
  const imports = flatMap(operations, (data) => [
    ...dependenciesOf(apiPath, data.channel, 'asyncapi/input-type'),
    ...dependenciesOf(apiPath, data.channel, 'asyncapi/channel'),
  ])
  return operations.length > 0
    ? [...imports, getNamedImports(RuntimePackages.Ws.name, [RuntimePackages.Ws.WebsocketConfig])]
    : imports
}
