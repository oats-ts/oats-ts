import { factory, MethodDeclaration, SyntaxKind } from 'typescript'
import { hasInput, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getSdkMethodParameterAsts } from './getSdkMethodParameterAsts'

export function getSdkClassMethodAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): MethodDeclaration {
  const { nameOf } = context

  const returnStatement = factory.createReturnStatement(
    factory.createCallExpression(
      factory.createIdentifier(nameOf(data.operation, 'openapi/operation')),
      [],
      [
        ...(hasInput(data, context) ? [factory.createIdentifier('input')] : []),
        factory.createObjectLiteralExpression([
          factory.createSpreadAssignment(
            factory.createPropertyAccessExpression(factory.createIdentifier('this'), 'config'),
          ),
          factory.createSpreadAssignment(factory.createIdentifier('config')),
        ]),
      ],
    ),
  )

  return factory.createMethodDeclaration(
    [],
    [factory.createModifier(SyntaxKind.PublicKeyword), factory.createModifier(SyntaxKind.AsyncKeyword)],
    undefined,
    nameOf(data.operation, 'openapi/operation'),
    undefined,
    [],
    getSdkMethodParameterAsts(data, context, false),
    factory.createTypeReferenceNode('Promise', [
      factory.createTypeReferenceNode(nameOf(data.operation, 'openapi/response-type')),
    ]),
    factory.createBlock([returnStatement]),
  )
}
