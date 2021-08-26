import { AsyncAPIGeneratorContext, EnhancedChannel, hasPathParams } from '@oats-ts/asyncapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { ChannelsGeneratorConfig } from '../types'
import { getPathParamsTypeAst } from './getPathParamsTypeAst'
import { values, flatMap } from 'lodash'
import { ImportDeclaration } from 'typescript'

export function generatePathParamsType(
  data: EnhancedChannel,
  context: AsyncAPIGeneratorContext,
  config: ChannelsGeneratorConfig,
): TypeScriptModule {
  const { pathOf, dereference, dependenciesOf } = context
  const { channel } = data
  const { parameters } = channel
  const hasPath = hasPathParams(data.channel, context)
  if (!hasPath) {
    return undefined
  }

  const path = pathOf(data.channel, 'asyncapi/path-type')

  const schemas = values(parameters)
    .map((param) => dereference(param))
    .map((param) => param.schema)

  const imports = flatMap(schemas, (schema): ImportDeclaration[] => dependenciesOf(path, schema, 'asyncapi/type'))

  return {
    content: [getPathParamsTypeAst(data, context, config)],
    dependencies: imports,
    path,
  }
}
