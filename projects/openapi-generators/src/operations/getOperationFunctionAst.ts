import { factory, FunctionDeclaration, ParameterDeclaration, SyntaxKind } from 'typescript'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext, hasInput } from '@oats-ts/openapi-common'
import { OperationsGeneratorConfig } from './typings'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { documentNode } from '@oats-ts/typescript-common'
import { OperationNames } from './OperationNames'
import { getOperationBodyAst } from './getOperationBodyAst'

export function getOperationFunctionAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): FunctionDeclaration {
  const { nameOf, referenceOf } = context
  const { operation } = data

  const params: ParameterDeclaration[] = [
    ...(hasInput(data, context) || (data.cookie.length > 0 && config.cookies)
      ? [
          factory.createParameterDeclaration(
            [],
            [],
            undefined,
            OperationNames.request,
            undefined,
            factory.createTypeReferenceNode(nameOf(operation, 'oats/request-type')),
          ),
        ]
      : []),
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
    nameOf(operation, 'oats/operation'),
    [],
    params,
    factory.createTypeReferenceNode('Promise', [referenceOf(operation, 'oats/response-type')]),
    getOperationBodyAst(data, context, config),
  )
  return config.documentation ? documentNode(node, operation) : node
}
