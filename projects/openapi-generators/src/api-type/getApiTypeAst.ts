import { OpenAPIObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getApiTypeMethodSignatureAst } from './getApiTypeMethodSignatureAst'
import { factory, SyntaxKind, TypeAliasDeclaration } from 'typescript'
import { ApiTypeGeneratorConfig } from './typings'

export function getApiTypeAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ApiTypeGeneratorConfig,
): TypeAliasDeclaration {
  return factory.createTypeAliasDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    context.nameOf(document, 'oats/api-type'),
    [],
    factory.createTypeLiteralNode(
      operations.map((operation) => getApiTypeMethodSignatureAst(operation, context, config)),
    ),
  )
}
