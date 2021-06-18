import {
  AssignmentPattern,
  assignmentPattern,
  ClassMethod,
  Identifier,
  identifier,
  objectExpression,
  tsTypeParameterInstantiation,
  tsTypeReference,
} from '@babel/types'
import { typedIdAst } from '../../common/babelUtils'
import { isOperationInputTypeRequired } from '../../operations/inputType/isOperationInputTypeRequired'
import { EnhancedOperation } from '../../operations/typings'
import { OpenAPIGeneratorContext } from '../../typings'

export function getApiMethodParameterAsts(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): (AssignmentPattern | Identifier)[] {
  const { accessor } = context

  const configParam = assignmentPattern(
    typedIdAst(
      'config',
      tsTypeReference(
        identifier('Partial'),
        tsTypeParameterInstantiation([tsTypeReference(identifier('RequestConfig'))]),
      ),
    ),
    objectExpression([]),
  )

  const parameters = isOperationInputTypeRequired(data, context)
    ? [
        typedIdAst('input', tsTypeReference(identifier(accessor.name(data.operation, 'operation-input-type')))),
        configParam,
      ]
    : [configParam]

  return parameters
}
