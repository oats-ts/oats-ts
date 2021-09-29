import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getApiTypeImports } from '../apiType/getApiTypeImports'
import { getApiClassAst } from './getApiClassAst'
import { RuntimePackages, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ApiGeneratorConfig } from '../typings'
import { flatMap } from 'lodash'
import { getNamedImports } from '@oats-ts/typescript-common'

export function generateApiClass(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ApiGeneratorConfig,
): TypeScriptModule {
  const { dependenciesOf, pathOf } = context
  const path = pathOf(doc, 'openapi/api-class')
  return {
    path,
    dependencies: [
      getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.ClientConfiguration]),
      ...getApiTypeImports(doc, operations, context, true),
      ...dependenciesOf(path, doc, 'openapi/api-type'),
      ...flatMap(operations, ({ operation }) => dependenciesOf(path, operation, 'openapi/operation')),
    ],
    content: [getApiClassAst(doc, operations, context, config)],
  }
}
