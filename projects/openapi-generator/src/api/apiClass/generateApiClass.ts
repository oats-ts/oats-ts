import { OpenAPIObject } from 'openapi3-ts'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getApiTypeImports } from '../apiType/getApiTypeImports'
import { getApiClassAst } from './getApiClassAst'
import { RuntimePackages, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { tsImportAst, tsModelImportAsts, tsRelativeImports } from '../../common/typeScriptUtils'
import { ApiGeneratorConfig } from '../typings'

export function generateApiClass(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ApiGeneratorConfig,
): TypeScriptModule {
  const { accessor } = context
  const path = accessor.path(doc, 'api-class')
  return {
    path,
    dependencies: [
      tsImportAst(RuntimePackages.Http.name, [RuntimePackages.Http.RequestConfig]),
      ...getApiTypeImports(doc, operations, context),
      ...tsRelativeImports(path, [[accessor.path(doc, 'api-type'), accessor.name(doc, 'api-type')]]),
      ...tsModelImportAsts(
        path,
        'operation',
        operations.map((o) => o.operation),
        context,
      ),
    ],
    content: [getApiClassAst(doc, operations, context, config)],
  }
}
