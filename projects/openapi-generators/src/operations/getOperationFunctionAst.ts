import { factory, FunctionDeclaration, ParameterDeclaration, SyntaxKind, TypeReferenceNode } from 'typescript'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { OperationsGeneratorConfig } from './typings'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { documentNode } from '@oats-ts/typescript-common'
import { OperationNames } from './OperationNames'
import { getOperationBodyAst } from './getOperationBodyAst'
import { isNil } from 'lodash'

export function getOperationFunctionAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): FunctionDeclaration {
  const { operation } = data

  const responseType = context.referenceOf<TypeReferenceNode>(operation, 'oats/response-type')
  const requestType = context.referenceOf<TypeReferenceNode>(operation, 'oats/request-type')
  const params: ParameterDeclaration[] = [
    ...(isNil(requestType)
      ? []
      : [factory.createParameterDeclaration([], [], undefined, OperationNames.request, undefined, requestType)]),
    factory.createParameterDeclaration(
      [],
      [],
      undefined,
      OperationNames.adapter,
      undefined,
      factory.createTypeReferenceNode(RuntimePackages.Http.ClientAdapter),
    ),
  ]

  const node = factory.createFunctionDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.AsyncKeyword)],
    undefined,
    context.nameOf(operation, 'oats/operation'),
    [],
    params,
    factory.createTypeReferenceNode('Promise', [
      isNil(responseType) ? factory.createTypeReferenceNode('void') : responseType,
    ]),
    getOperationBodyAst(data, context, config),
  )
  return config.documentation ? documentNode(node, operation) : node
}
