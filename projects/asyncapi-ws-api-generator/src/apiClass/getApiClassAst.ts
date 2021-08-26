import { factory, ClassDeclaration, SyntaxKind } from 'typescript'
import { AsyncApiObject } from '@oats-ts/asyncapi-model'
import { EnhancedChannel } from '@oats-ts/asyncapi-common'
import { RuntimePackages, AsyncAPIGeneratorContext } from '@oats-ts/asyncapi-common'
import { getApiClassMethodAst } from './getApiClassMethodAst'
import { ApiGeneratorConfig } from '../types'

export function getApiClassAst(
  document: AsyncApiObject,
  operations: EnhancedChannel[],
  context: AsyncAPIGeneratorContext,
  config: ApiGeneratorConfig,
): ClassDeclaration {
  const { nameOf } = context

  const configField = factory.createPropertyDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ProtectedKeyword), factory.createModifier(SyntaxKind.ReadonlyKeyword)],
    'config',
    undefined,
    factory.createTypeReferenceNode(RuntimePackages.Ws.WebsocketConfig),
    undefined,
  )

  const constructor = factory.createConstructorDeclaration(
    [],
    [factory.createModifier(SyntaxKind.PublicKeyword)],
    [
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        'config',
        undefined,
        factory.createTypeReferenceNode(RuntimePackages.Ws.WebsocketConfig),
      ),
    ],
    factory.createBlock([
      factory.createExpressionStatement(
        factory.createBinaryExpression(
          factory.createPropertyAccessExpression(factory.createIdentifier('this'), 'config'),
          SyntaxKind.EqualsToken,
          factory.createIdentifier('config'),
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
    nameOf(document, 'asyncapi/api-class'),
    [],
    heritageClauses,
    [configField, constructor, ...operations.map((operation) => getApiClassMethodAst(operation, context))],
  )
}
