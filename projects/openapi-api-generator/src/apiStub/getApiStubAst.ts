import { OpenAPIObject } from 'openapi3-ts'
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

  const fallback = factory.createMethodDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ProtectedKeyword)],
    undefined,
    'fallback',
    undefined,
    [],
    [],
    factory.createTypeReferenceNode('never'),
    factory.createBlock([
      factory.createThrowStatement(
        factory.createNewExpression(
          factory.createIdentifier('Error'),
          [],
          [factory.createStringLiteral('Not implemented.')],
        ),
      ),
    ]),
  )

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
    [fallback, ...operations.map((operation) => getApiStubMethodAst(operation, context))],
  )
}
