import { getResponseHeaders, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { factory, SyntaxKind } from 'typescript'
import { ParameterTypesGeneratorConfig } from '../typings'
import { flatMap, isNil, negate, values } from 'lodash'
import { getParameterTypeLiteralAst } from '../getParameterTypeLiteralAst'

export const generateResponseHeaderType = (
  data: EnhancedOperation,
  status: string,
  context: OpenAPIGeneratorContext,
  config: ParameterTypesGeneratorConfig,
): TypeScriptModule => {
  const { operation } = data
  const { pathOf, nameOf, dereference, dependenciesOf } = context
  const fromPath = pathOf([operation, status], 'openapi/response-headers-type')
  const headers = values(getResponseHeaders(operation, context)[status]).map((header) => dereference(header, true))
  const types = headers.map((header) => header.schema).filter(negate(isNil))
  return {
    path: fromPath,
    dependencies: [...flatMap(types, (type) => dependenciesOf(fromPath, type, 'json-schema/type'))],
    content: [
      factory.createTypeAliasDeclaration(
        [],
        [factory.createModifier(SyntaxKind.ExportKeyword)],
        nameOf([operation, status], 'openapi/response-headers-type'),
        undefined,
        getParameterTypeLiteralAst(headers, context, config),
      ),
    ],
  }
}
