import { OpenAPIObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getApiStubMethodAst } from './getApiStubMethodAst'
import { ClassDeclaration, factory, SyntaxKind } from 'typescript'
import { ApiGeneratorConfig } from '../typings'

export function getApiStubAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ApiGeneratorConfig,
): ClassDeclaration {
  const { nameOf } = context

  const heritageClauses = config.type
    ? [
        factory.createHeritageClause(SyntaxKind.ImplementsKeyword, [
          factory.createExpressionWithTypeArguments(factory.createIdentifier(nameOf(document, 'openapi/api-type')), []),
        ]),
      ]
    : []

  return factory.createClassDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    nameOf(document, 'openapi/api-stub'),
    [],
    heritageClauses,
    operations.map((operation) => getApiStubMethodAst(operation, context)),
  )
}
