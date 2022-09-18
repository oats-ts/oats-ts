import { factory, MethodDeclaration, SyntaxKind } from 'typescript'
import { hasInput, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getSdkMethodParameterAsts } from '../utils/sdk/getSdkMethodParameterAsts'
import { Names } from './Names'
import { SdkGeneratorConfig } from '../utils/sdk/typings'

export function getSdkClassMethodAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: SdkGeneratorConfig,
): MethodDeclaration {
  const { nameOf } = context

  const returnStatement = factory.createReturnStatement(
    factory.createCallExpression(
      factory.createIdentifier(nameOf(data.operation, 'oats/operation')),
      [],
      [
        ...(hasInput(data, context, config.cookies) ? [factory.createIdentifier('request')] : []),
        factory.createPropertyAccessExpression(factory.createIdentifier('this'), Names.adapter),
      ],
    ),
  )

  return factory.createMethodDeclaration(
    [],
    [factory.createModifier(SyntaxKind.PublicKeyword), factory.createModifier(SyntaxKind.AsyncKeyword)],
    undefined,
    nameOf(data.operation, 'oats/operation'),
    undefined,
    [],
    getSdkMethodParameterAsts(data, context, config),
    factory.createTypeReferenceNode('Promise', [
      factory.createTypeReferenceNode(nameOf(data.operation, 'oats/response-type')),
    ]),
    factory.createBlock([returnStatement]),
  )
}
