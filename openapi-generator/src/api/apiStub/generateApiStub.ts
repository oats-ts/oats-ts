import { OpenAPIObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '../../operations/typings'
import { getApiTypeImports } from '../apiType/getApiTypeImports'
import { Http } from '../../common/OatsPackages'
import { getApiStubAst } from './getApiStubAst'
import { tsImportAst, tsRelativeImports } from '../../common/typeScriptUtils'
import { ApiGeneratorConfig } from '../typings'

export function generateApiStub(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ApiGeneratorConfig,
): TypeScriptModule {
  const { accessor } = context
  const path = accessor.path(doc, 'api-stub')
  return {
    path,
    dependencies: [
      tsImportAst(Http.name, [Http.RequestConfig]),
      ...getApiTypeImports(doc, operations, context),
      ...tsRelativeImports(path, [[accessor.path(doc, 'api-type'), accessor.name(doc, 'api-type')]]),
    ],
    content: [getApiStubAst(doc, operations, context, config)],
  }
}
