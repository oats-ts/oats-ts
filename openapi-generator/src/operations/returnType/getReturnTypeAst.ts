import {
  exportNamedDeclaration,
  ExportNamedDeclaration,
  identifier,
  numericLiteral,
  tsLiteralType,
  tsTypeAliasDeclaration,
  tsTypeParameterInstantiation,
  tsTypeReference,
  tsUnionType,
  TSType,
  tsVoidKeyword,
} from '@babel/types'
import { entries, head, isNil } from 'lodash'
import { Http } from '../../common/OatsPackages'
import { getTypeReferenceAst } from '../../types/getTypeReferenceAst'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getResponseMap } from './getResponseMap'

export function getReturnTypeAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): ExportNamedDeclaration {
  const { accessor } = context
  const responses = entries(getResponseMap(data.operation, context))
  const types: TSType[] = []
  if (responses.length === 0) {
    types.push(tsTypeReference(identifier(Http.HttpResponse), tsTypeParameterInstantiation([tsVoidKeyword()])))
  }

  const defaultResponse = responses.find(([status]) => status === 'default')
  const statusCodeResponses = responses.filter(([status]) => status !== 'default')
  types.push(
    ...statusCodeResponses.map(([status, schema]) =>
      tsTypeReference(
        identifier(Http.HttpResponse),
        tsTypeParameterInstantiation([
          getTypeReferenceAst(schema, context),
          tsLiteralType(numericLiteral(Number(status))),
        ]),
      ),
    ),
  )
  if (!isNil(defaultResponse)) {
    const knownStatusCodesType = tsUnionType(
      statusCodeResponses.map(([status]) => tsLiteralType(numericLiteral(Number(status)))),
    )
    const [, schema] = defaultResponse
    const type = tsTypeReference(
      identifier(Http.HttpResponse),
      tsTypeParameterInstantiation([
        getTypeReferenceAst(schema, context),
        tsTypeReference(
          identifier('Exclude'),
          tsTypeParameterInstantiation([tsTypeReference(identifier(Http.StatusCode)), knownStatusCodesType]),
        ),
      ]),
    )
    types.push(type)
  }
  return exportNamedDeclaration(
    tsTypeAliasDeclaration(
      identifier(accessor.name(data.operation, 'operation-return-type')),
      undefined,
      types.length === 1 ? head(types) : tsUnionType(types),
    ),
  )
}
