import { factory, MethodDeclaration, SyntaxKind, TypeReferenceNode } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getSdkMethodParameterAsts } from '../utils/sdk/getSdkMethodParameterAsts'
import { Names } from './Names'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { isNil } from 'lodash'

export function getSdkClassMethodAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: SdkGeneratorConfig,
): MethodDeclaration {
  const parameters = getSdkMethodParameterAsts(data, context)
  const responseType = context.referenceOf<TypeReferenceNode>(data.operation, 'oats/response-type')

  const returnStatement = factory.createReturnStatement(
    factory.createCallExpression(
      factory.createIdentifier(context.nameOf(data.operation, 'oats/operation')),
      [],
      [
        ...(parameters.length === 1 ? [factory.createIdentifier('request')] : []),
        factory.createPropertyAccessExpression(factory.createIdentifier('this'), Names.adapter),
      ],
    ),
  )

  return factory.createMethodDeclaration(
    [],
    [factory.createModifier(SyntaxKind.PublicKeyword), factory.createModifier(SyntaxKind.AsyncKeyword)],
    undefined,
    context.nameOf(data.operation, 'oats/operation'),
    undefined,
    [],
    parameters,
    factory.createTypeReferenceNode('Promise', [
      isNil(responseType) ? factory.createTypeReferenceNode('void') : responseType,
    ]),
    factory.createBlock([returnStatement]),
  )
}
