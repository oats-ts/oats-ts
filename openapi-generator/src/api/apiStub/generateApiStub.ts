import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { BabelModule } from '../../../../babel-writer/lib'
import { EnhancedOperation } from '../../operations/typings'
import { getApiTypeImports } from '../apiType/getApiTypeImports'
import { getImports } from '../../common/getImports'
import { Http } from '../../common/OatsPackages'
import { importAst } from '../../common/babelUtils'
import { getApiStubAst } from './getApiStubAst'

export function generateApiStub(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  implement: boolean,
): BabelModule {
  const { accessor } = context
  const path = accessor.path(doc, 'api-stub')
  return {
    imports: [
      importAst(Http.name, [Http.RequestConfig]),
      ...getApiTypeImports(doc, operations, context),
      ...getImports(path, [[accessor.path(doc, 'api-type'), accessor.name(doc, 'api-type')]]),
    ],
    path,
    statements: [getApiStubAst(doc, operations, context, implement)],
  }
}
