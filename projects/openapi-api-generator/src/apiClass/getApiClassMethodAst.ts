import { factory, MethodDeclaration, SyntaxKind } from 'typescript'
import { hasInput, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getApiMethodParameterAsts } from './getApiMethodParameterAsts'
import { getApiMethodReturnTypeAst } from './getApiMethodReturnTypeAst'

export function getApiClassMethodAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): MethodDeclaration {
  const { accessor } = context

  const returnStatement = factory.createReturnStatement(
    factory.createCallExpression(
      factory.createIdentifier(accessor.name(data.operation, 'operation')),
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
    accessor.name(data.operation, 'operation'),
    undefined,
    [],
    getApiMethodParameterAsts(data, context), // TODO parameters
    getApiMethodReturnTypeAst(data, context), // TODO type
    factory.createBlock([returnStatement]),
  )
}
