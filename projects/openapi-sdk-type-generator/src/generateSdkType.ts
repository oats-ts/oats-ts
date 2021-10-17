import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getSdkTypeImports } from '@oats-ts/openapi-sdk-common'
import { getSdkTypeAst } from './getSdkTypeAst'
import { SdkTypeGeneratorConfig } from './typings'

export function generateSdkType(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: SdkTypeGeneratorConfig,
): TypeScriptModule {
  const { pathOf } = context
  return {
    path: pathOf(doc, 'openapi/sdk-type'),
    dependencies: getSdkTypeImports(doc, operations, context, true),
    content: [getSdkTypeAst(doc, operations, context, config)],
  }
}
