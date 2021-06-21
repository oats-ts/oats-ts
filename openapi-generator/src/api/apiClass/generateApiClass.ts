import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { TypeScriptModule } from '../../../../babel-writer/lib'
import { EnhancedOperation } from '../../operations/typings'
import { getApiTypeImports } from '../apiType/getApiTypeImports'
import { getApiClassAst } from './getApiClassAst'
import { Http } from '../../common/OatsPackages'
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
    imports: [
      tsImportAst(Http.name, [Http.RequestConfig]),
      ...getApiTypeImports(doc, operations, context),
      ...tsRelativeImports(path, [[accessor.path(doc, 'api-type'), accessor.name(doc, 'api-type')]]),
      ...tsModelImportAsts(
        path,
        'operation',
        operations.map((o) => o.operation),
        context,
      ),
    ],
    path,
    statements: [getApiClassAst(doc, operations, context, config)],
  }
}
