import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { BabelModule } from '../../../../babel-writer/lib'
import { EnhancedOperation } from '../../operations/typings'
import { getApiTypeImports } from '../apiType/getApiTypeImports'
import { getImports } from '../../common/getImports'
import { getApiClassAst } from './getApiClassAst'
import { Http } from '../../common/OatsPackages'
import { getImportDeclarations } from '../../common/getImportDeclarations'
import { importAst } from '../../common/babelUtils'

export function generateApiClass(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
): BabelModule {
  const { accessor } = context
  const path = accessor.path(doc, 'api-class')
  return {
    imports: [
      importAst(Http.name, [Http.RequestConfig]),
      ...getApiTypeImports(doc, operations, context),
      ...getImports(path, [[accessor.path(doc, 'api-type'), accessor.name(doc, 'api-type')]]),
      ...getImportDeclarations(
        path,
        'operation',
        operations.map((o) => o.operation),
        context,
      ),
    ],
    path,
    statements: [getApiClassAst(doc, operations, context)],
  }
}
