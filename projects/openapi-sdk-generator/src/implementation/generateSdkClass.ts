import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getSdkClassAst } from './getSdkClassAst'
import { RuntimePackages, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { SdkGeneratorConfig } from '../typings'
import { flatMap } from 'lodash'
import { getNamedImports } from '@oats-ts/typescript-common'
import { getSdkTypeImports } from '../getSdkTypeImports'

export function generateSdkClass(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: SdkGeneratorConfig,
): TypeScriptModule {
  const { dependenciesOf, pathOf } = context
  const path = pathOf(doc, 'openapi/sdk-impl')
  return {
    path,
    dependencies: [
      getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.ClientAdapter]),
      ...getSdkTypeImports(doc, operations, context, true),
      ...dependenciesOf(path, doc, 'openapi/sdk-type'),
      ...flatMap(operations, ({ operation }) => dependenciesOf(path, operation, 'openapi/operation')),
    ],
    content: [getSdkClassAst(doc, operations, context, config)],
  }
}
