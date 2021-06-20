import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { TypeScriptModule } from '../../../../babel-writer/lib'
import { EnhancedOperation } from '../../operations/typings'
import { getApiTypeImports } from '../apiType/getApiTypeImports'
import { Http } from '../../common/OatsPackages'
import { getApiStubAst } from './getApiStubAst'
import { tsImportAst, tsRelativeImports } from '../../common/typeScriptUtils'

export function generateApiStub(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  implement: boolean,
): TypeScriptModule {
  const { accessor } = context
  const path = accessor.path(doc, 'api-stub')
  return {
    imports: [
      tsImportAst(Http.name, [Http.RequestConfig]),
      ...getApiTypeImports(doc, operations, context),
      ...tsRelativeImports(path, [[accessor.path(doc, 'api-type'), accessor.name(doc, 'api-type')]]),
    ],
    path,
    statements: [getApiStubAst(doc, operations, context, implement)],
  }
}
