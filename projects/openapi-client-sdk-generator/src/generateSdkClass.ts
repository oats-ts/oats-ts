import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getSdkTypeImports } from './getSdkTypeImports'
import { getSdkClassAst } from './getSdkClassAst'
import { RuntimePackages, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ClientSdkGeneratorConfig } from './typings'
import { flatMap } from 'lodash'
import { getNamedImports } from '@oats-ts/typescript-common'

export function generateSdkClass(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ClientSdkGeneratorConfig,
): TypeScriptModule {
  const { dependenciesOf, pathOf } = context
  const path = pathOf(doc, 'openapi/sdk-implementation')
  return {
    path,
    dependencies: [
      getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.ClientConfiguration]),
      ...getSdkTypeImports(doc, operations, context, true),
      ...dependenciesOf(path, doc, 'openapi/sdk-type'),
      ...flatMap(operations, ({ operation }) => dependenciesOf(path, operation, 'openapi/operation')),
    ],
    content: [getSdkClassAst(doc, operations, context, config)],
  }
}
