import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getSdkTypeImports } from '../type/getSdkTypeImports'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getSdkStubAst } from './getSdkStubAst'
import { SdkGeneratorConfig } from '../typings'

export function generateSdkStub(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: SdkGeneratorConfig,
): TypeScriptModule {
  const { dependenciesOf, pathOf } = context
  const path = pathOf(doc, 'openapi/sdk-stub')
  return {
    path,
    dependencies: [
      ...getSdkTypeImports(doc, operations, context, true),
      ...dependenciesOf(path, doc, 'openapi/sdk-type'),
    ],
    content: [getSdkStubAst(doc, operations, context, config)],
  }
}
