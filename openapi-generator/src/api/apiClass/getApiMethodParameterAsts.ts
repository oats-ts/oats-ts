import { factory, ParameterDeclaration } from 'typescript'
import { Http } from '../../common/OatsPackages'
import { isOperationInputTypeRequired } from '../../operations/inputType/isOperationInputTypeRequired'
import { EnhancedOperation } from '../../operations/typings'
import { OpenAPIGeneratorContext } from '../../typings'

export function getApiMethodParameterAsts(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ParameterDeclaration[] {
  const { accessor } = context

  const parameters: ParameterDeclaration[] = []

  if (isOperationInputTypeRequired(data, context)) {
    parameters.unshift(
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
      undefined,
      factory.createTypeReferenceNode('Partial', [factory.createTypeReferenceNode(Http.RequestConfig)]),
      factory.createObjectLiteralExpression([]),
    ),
  )

  return parameters
}
