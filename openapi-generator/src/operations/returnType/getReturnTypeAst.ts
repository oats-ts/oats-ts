import { entries, head, isNil } from 'lodash'
import { factory, TypeAliasDeclaration, TypeReferenceNode } from 'typescript'
import { Http } from '../../common/OatsPackages'
import { tsExportModifier } from '../../common/typeScriptUtils'
import { getTypeReferenceAst } from '../../types/getTypeReferenceAst'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getResponseMap } from './getResponseMap'

export function getReturnTypeAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeAliasDeclaration {
  const { accessor } = context
  const responses = entries(getResponseMap(data.operation, context))
  const types: TypeReferenceNode[] = []
  if (responses.length === 0) {
    types.push(factory.createTypeReferenceNode(Http.HttpResponse, [factory.createTypeReferenceNode('void')]))
  }

  const defaultResponse = responses.find(([status]) => status === 'default')
  const statusCodeResponses = responses.filter(([status]) => status !== 'default')
  types.push(
    ...statusCodeResponses.map(([status, schema]) =>
      factory.createTypeReferenceNode(Http.HttpResponse, [
        getTypeReferenceAst(schema, context),
        factory.createLiteralTypeNode(factory.createNumericLiteral(status)),
      ]),
    ),
  )
  if (!isNil(defaultResponse)) {
    const knownStatusCodesType = factory.createUnionTypeNode(
      statusCodeResponses.map(([status]) => factory.createLiteralTypeNode(factory.createNumericLiteral(status))),
    )
    const [, schema] = defaultResponse
    const type = factory.createTypeReferenceNode(Http.HttpResponse, [
      getTypeReferenceAst(schema, context),
      factory.createTypeReferenceNode('Exclude', [
        factory.createTypeReferenceNode(Http.StatusCode),
        knownStatusCodesType,
      ]),
    ])
    types.push(type)
  }
  return factory.createTypeAliasDeclaration(
    [],
    [tsExportModifier()],
    accessor.name(data.operation, 'operation-return-type'),
    undefined,
    types.length === 1 ? head(types) : factory.createUnionTypeNode(types),
  )
}
