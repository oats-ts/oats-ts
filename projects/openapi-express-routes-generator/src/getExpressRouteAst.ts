import { EnhancedOperation, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { factory, VariableStatement, SyntaxKind, NodeFlags } from 'typescript'
import { getPathTemplate } from './getPathTemplate'

export function getExpressRouteAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): VariableStatement {
  const { nameOf } = context
  const { operation, url } = data

  const routeAst = factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createCallExpression(factory.createIdentifier(RuntimePackages.Express.Router), [], []),
      data.method.toLowerCase(),
    ),
    [],
    [
      factory.createStringLiteral(getPathTemplate(url)),
      factory.createArrowFunction(
        [factory.createModifier(SyntaxKind.AsyncKeyword)],
        [],
        [
          factory.createParameterDeclaration(
            [],
            [],
            undefined,
            'request',
            undefined,
            factory.createTypeReferenceNode(RuntimePackages.Express.Request),
          ),
          factory.createParameterDeclaration(
            [],
            [],
            undefined,
            'response',
            undefined,
            factory.createTypeReferenceNode(RuntimePackages.Express.Response),
          ),
          factory.createParameterDeclaration(
            [],
            [],
            undefined,
            'next',
            undefined,
            factory.createTypeReferenceNode(RuntimePackages.Express.NextFunction),
          ),
        ],
        factory.createTypeReferenceNode('Promise', [factory.createKeywordTypeNode(SyntaxKind.VoidKeyword)]),
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        factory.createBlock([]),
      ),
    ],
  )

  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          nameOf(operation, 'openapi/express-route'),
          undefined,
          factory.createTypeReferenceNode(RuntimePackages.Express.Router),
          routeAst,
        ),
      ],
      NodeFlags.Const,
    ),
  )
}
