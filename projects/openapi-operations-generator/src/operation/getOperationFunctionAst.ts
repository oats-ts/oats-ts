import { factory, FunctionDeclaration, ParameterDeclaration, SyntaxKind } from 'typescript'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext, hasInput } from '@oats-ts/openapi-common'
import { getOperationReturnTypeReferenceAst } from '../returnType/getReturnTypeReferenceAst'
import { OperationsGeneratorConfig } from '../typings'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { documentNode } from '@oats-ts/typescript-common'
import { getOperationExecuteAst } from './getOperationRequestAst'

export function getOperationFunctionAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): FunctionDeclaration {
  const { accessor } = context
  const { operation } = data

  const params: ParameterDeclaration[] = []

  if (hasInput(data, context)) {
    params.push(
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        'input',
        undefined,
        factory.createTypeReferenceNode(accessor.name(operation, 'openapi/input-type')),
      ),
    )
  }

  params.push(
    factory.createParameterDeclaration(
      [],
      [],
      undefined,
      'config',
      undefined,
      factory.createTypeReferenceNode(RuntimePackages.Http.RequestConfig),
    ),
  )

  const node = factory.createFunctionDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.AsyncKeyword)],
    undefined,
    accessor.name(operation, 'openapi/operation'),
    [],
    params,
    factory.createTypeReferenceNode('Promise', [getOperationReturnTypeReferenceAst(operation, context)]),
    factory.createBlock([factory.createReturnStatement(getOperationExecuteAst(data, context, config))]),
  )
  return config.documentation ? documentNode(node, operation) : node
}
