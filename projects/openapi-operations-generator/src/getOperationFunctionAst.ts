import { factory, FunctionDeclaration, ParameterDeclaration, SyntaxKind } from 'typescript'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext, hasInput } from '@oats-ts/openapi-common'
import { OperationsGeneratorConfig } from './typings'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { documentNode } from '@oats-ts/typescript-common'
import { getOperationExecuteAst } from './getOperationRequestAst'

export function getOperationFunctionAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): FunctionDeclaration {
  const { nameOf, referenceOf } = context
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
        factory.createTypeReferenceNode(nameOf(operation, 'openapi/request-type')),
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
      factory.createTypeReferenceNode(RuntimePackages.Http.ClientConfiguration),
    ),
  )

  const node = factory.createFunctionDeclaration(
    [],
    [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.AsyncKeyword)],
    undefined,
    nameOf(operation, 'openapi/operation'),
    [],
    params,
    factory.createTypeReferenceNode('Promise', [referenceOf(operation, 'openapi/response-type')]),
    factory.createBlock([factory.createReturnStatement(getOperationExecuteAst(data, context, config))]),
  )
  return config.documentation ? documentNode(node, operation) : node
}
