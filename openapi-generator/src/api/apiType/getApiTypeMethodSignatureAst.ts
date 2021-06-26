import { OpenAPIGeneratorContext } from '../../typings'
import { isOperationInputTypeRequired } from '../../operations/inputType/isOperationInputTypeRequired'
import { getOperationReturnTypeReferenceAst } from '../../operations/returnType/getReturnTypeReferenceAst'
import { EnhancedOperation } from '../../operations/typings'
import { factory, MethodSignature, ParameterDeclaration, SyntaxKind } from 'typescript'
import { Http } from '../../common/OatsPackages'
import { ApiGeneratorConfig } from '../typings'
import { documentOperation } from '../../common/jsDoc'

export function getApiTypeMethodSignatureAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  config: ApiGeneratorConfig,
): MethodSignature {
  const { accessor } = context

  const parameters: ParameterDeclaration[] = []

  if (isOperationInputTypeRequired(data, context)) {
    parameters.push(
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        'input',
        undefined,
        factory.createTypeReferenceNode(accessor.name(data.operation, 'operation-input-type')),
      ),
    )
  }

  parameters.push(
    factory.createParameterDeclaration(
      [],
      [],
      undefined,
      'config',
      factory.createToken(SyntaxKind.QuestionToken),
      factory.createTypeReferenceNode('Partial', [factory.createTypeReferenceNode(Http.RequestConfig)]),
    ),
  )

  const returnType = factory.createTypeReferenceNode('Promise', [
    getOperationReturnTypeReferenceAst(data.operation, context),
  ])

  return documentOperation(
    factory.createMethodSignature(
      [],
      accessor.name(data.operation, 'operation'),
      undefined,
      [],
      parameters,
      returnType,
    ),
    data.operation,
    config,
  )
}
