import { factory, FunctionDeclaration, ParameterDeclaration } from 'typescript'
import { Http } from '../../common/OatsPackages'
import { tsAsyncModifier, tsExportModifier } from '../../common/typeScriptUtils'
import { OpenAPIGeneratorContext } from '../../typings'
import { isOperationInputTypeRequired } from '../inputType/isOperationInputTypeRequired'
import { getOperationReturnTypeReferenceAst } from '../returnType/getReturnTypeReferenceAst'
import { EnhancedOperation } from '../typings'
import { getOperationParseAst } from './getOperationParseAst'

export function getOperationFunctionAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
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
      factory.createTypeReferenceNode(Http.RequestConfig),
    ),
  )

  return factory.createFunctionDeclaration(
    [],
    [tsExportModifier(), tsAsyncModifier()],
    undefined,
    accessor.name(operation, 'operation'),
    [],
    params,
    factory.createTypeReferenceNode('Promise', [getOperationReturnTypeReferenceAst(operation, context)]),
    factory.createBlock([factory.createReturnStatement(getOperationParseAst(data, context))]),
  )
}
