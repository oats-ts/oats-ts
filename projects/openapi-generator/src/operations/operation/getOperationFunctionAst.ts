import { factory, FunctionDeclaration, ParameterDeclaration, SyntaxKind } from 'typescript'
import { documentOperation } from '../../common/jsDoc'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { isOperationInputTypeRequired } from '../inputType/isOperationInputTypeRequired'
import { getOperationReturnTypeReferenceAst } from '../returnType/getReturnTypeReferenceAst'
import { OperationsGeneratorConfig } from '../typings'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getOperationParseAst } from './getOperationParseAst'

export function getOperationFunctionAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): FunctionDeclaration {
  const { accessor } = context
  const { operation } = data

  const params: ParameterDeclaration[] = []

  if (isOperationInputTypeRequired(data, context)) {
    params.push(
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        'input',
        undefined,
        factory.createTypeReferenceNode(accessor.name(operation, 'operation-input-type')),
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

  return documentOperation(
    factory.createFunctionDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword), factory.createModifier(SyntaxKind.AsyncKeyword)],
      undefined,
      accessor.name(operation, 'operation'),
      [],
      params,
      factory.createTypeReferenceNode('Promise', [getOperationReturnTypeReferenceAst(operation, context)]),
      factory.createBlock([factory.createReturnStatement(getOperationParseAst(data, context))]),
    ),
    data.operation,
    config,
  )
}
