import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getSdkTypeAst } from './getSdkTypeAst'
import { SdkGeneratorConfig } from '../typings'
import { getSdkTypeImports } from '../getSdkTypeImports'

export function generateSdkType(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: SdkGeneratorConfig,
): TypeScriptModule {
  const { pathOf } = context
  return {
    path: pathOf(doc, 'openapi/sdk-type'),
    dependencies: getSdkTypeImports(doc, operations, context, true),
    content: [getSdkTypeAst(doc, operations, context, config)],
  }
}
