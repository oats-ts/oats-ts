import { OpenAPIObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getSdkTypeMethodSignatureAst } from './getApiTypeMethodSignatureAst'
import { factory, SyntaxKind, TypeAliasDeclaration } from 'typescript'
import { ApiTypeGeneratorConfig } from './typings'

export function getApiTypeAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ApiTypeGeneratorConfig,
): TypeAliasDeclaration {
  const { nameOf } = context
  return factory.createTypeAliasDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    nameOf(document, 'openapi/api-type'),
    [factory.createTypeParameterDeclaration('T')],
    factory.createTypeLiteralNode(
      operations.map((operation) => getSdkTypeMethodSignatureAst(operation, context, config)),
    ),
  )
}
