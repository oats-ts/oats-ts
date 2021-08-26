import { EnhancedChannel, AsyncAPIGeneratorContext } from '@oats-ts/asyncapi-common'
import { getApiMethodParameterAsts } from '../apiClass/getApiMethodParameterAsts'
import { getApiMethodReturnTypeAst } from '../apiClass/getApiMethodReturnTypeAst'
import { factory, MethodDeclaration, SyntaxKind } from 'typescript'

export function getApiStubMethodAst(data: EnhancedChannel, context: AsyncAPIGeneratorContext): MethodDeclaration {
  const { nameOf } = context

  const returnStatement = factory.createReturnStatement(
    factory.createCallExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier('this'), 'fallback'),
      [],
      [],
    ),
  )

  return factory.createMethodDeclaration(
    [],
    [factory.createModifier(SyntaxKind.PublicKeyword)],
    undefined,
    nameOf(data.channel, 'asyncapi/channel-factory'),
    undefined,
    [],
    getApiMethodParameterAsts(data, context),
    getApiMethodReturnTypeAst(data, context),
    factory.createBlock([returnStatement]),
  )
}
