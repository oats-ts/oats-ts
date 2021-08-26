import { AsyncApiObject } from '@oats-ts/asyncapi-model'
import { EnhancedChannel, AsyncAPIGeneratorContext } from '@oats-ts/asyncapi-common'
import { getApiStubMethodAst } from './getApiStubMethodAst'
import { ClassDeclaration, factory, SyntaxKind } from 'typescript'
import { ApiGeneratorConfig } from '../types'

export function getApiStubAst(
  document: AsyncApiObject,
  operations: EnhancedChannel[],
  context: AsyncAPIGeneratorContext,
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
          factory.createExpressionWithTypeArguments(
            factory.createIdentifier(nameOf(document, 'asyncapi/api-type')),
            [],
          ),
        ]),
      ]
    : []

  return factory.createClassDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    nameOf(document, 'asyncapi/api-stub'),
    [],
    heritageClauses,
    [fallback, ...operations.map((operation) => getApiStubMethodAst(operation, context))],
  )
}
