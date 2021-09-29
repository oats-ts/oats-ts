import { factory, ClassDeclaration, SyntaxKind } from 'typescript'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { RuntimePackages, EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getApiClassMethodAst } from './getApiClassMethodAst'
import { ApiGeneratorConfig } from '../typings'

export function getApiClassAst(
  document: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  config: ApiGeneratorConfig,
): ClassDeclaration {
  const { nameOf } = context

  const configField = factory.createPropertyDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ProtectedKeyword), factory.createModifier(SyntaxKind.ReadonlyKeyword)],
    'config',
    undefined,
    factory.createTypeReferenceNode(RuntimePackages.Http.ClientConfiguration),
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
        factory.createTypeReferenceNode(RuntimePackages.Http.ClientConfiguration),
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
          factory.createExpressionWithTypeArguments(factory.createIdentifier(nameOf(document, 'openapi/api-type')), []),
        ]),
      ]
    : []

  return factory.createClassDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    nameOf(document, 'openapi/api-class'),
    [],
    heritageClauses,
    [configField, constructor, ...operations.map((operation) => getApiClassMethodAst(operation, context))],
  )
}
