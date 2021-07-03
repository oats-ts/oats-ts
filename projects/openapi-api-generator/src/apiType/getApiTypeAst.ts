import { OpenAPIObject } from 'openapi3-ts'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getApiTypeMethodSignatureAst } from './getApiTypeMethodSignatureAst'
import { factory, SyntaxKind, TypeAliasDeclaration } from 'typescript'
import { ApiGeneratorConfig } from '../typings'

export function getApiTypeAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ApiGeneratorConfig,
): TypeAliasDeclaration {
  const { accessor } = context
  return factory.createTypeAliasDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    accessor.name(document, 'openapi/api-type'),
    [],
    factory.createTypeLiteralNode(
      operations.map((operation) => getApiTypeMethodSignatureAst(operation, context, config)),
    ),
  )
}
