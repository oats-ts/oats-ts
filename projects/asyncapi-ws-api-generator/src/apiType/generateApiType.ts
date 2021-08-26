import { AsyncApiObject } from '@oats-ts/asyncapi-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { getApiTypeAst } from './getApiTypeAst'
import { getApiTypeImports } from './getApiTypeImports'
import { ApiGeneratorConfig } from '../types'
import { AsyncAPIGeneratorContext, EnhancedChannel } from '@oats-ts/asyncapi-common'

export function generateApiType(
  doc: AsyncApiObject,
  channels: EnhancedChannel[],
  context: AsyncAPIGeneratorContext,
  config: ApiGeneratorConfig,
): TypeScriptModule {
  const { pathOf } = context
  return {
    path: pathOf(doc, 'asyncapi/api-type'),
    dependencies: getApiTypeImports(doc, channels, context),
    content: [getApiTypeAst(doc, channels, context, config)],
  }
}
