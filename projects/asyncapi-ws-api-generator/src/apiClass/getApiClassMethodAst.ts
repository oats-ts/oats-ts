import { factory, MethodDeclaration, SyntaxKind } from 'typescript'
import { EnhancedChannel, hasInput } from '@oats-ts/asyncapi-common'
import { AsyncAPIGeneratorContext } from '@oats-ts/asyncapi-common'
import { getApiMethodParameterAsts } from './getApiMethodParameterAsts'
import { getApiMethodReturnTypeAst } from './getApiMethodReturnTypeAst'

export function getApiClassMethodAst(data: EnhancedChannel, context: AsyncAPIGeneratorContext): MethodDeclaration {
  const { nameOf } = context

  const returnStatement = factory.createReturnStatement(
    factory.createCallExpression(
      factory.createIdentifier(nameOf(data.channel, 'asyncapi/channel-factory')),
      [],
      [
        ...(hasInput(data.channel, context) ? [factory.createIdentifier('input')] : []),
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
    [factory.createModifier(SyntaxKind.PublicKeyword)],
    undefined,
    nameOf(data.channel, 'asyncapi/channel-factory'),
    undefined,
    [],
    getApiMethodParameterAsts(data, context), // TODO parameters
    getApiMethodReturnTypeAst(data, context), // TODO type
    factory.createBlock([returnStatement]),
  )
}
