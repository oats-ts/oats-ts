import {
  identifier,
  TSMethodSignature,
  tsMethodSignature,
  tsTypeAnnotation,
  tsTypeParameterInstantiation,
  tsTypeReference,
} from '@babel/types'
import { typedIdAst } from '../../common/babelUtils'
import { OpenAPIGeneratorContext } from '../../typings'
import { isOperationInputTypeRequired } from '../inputType/isOperationInputTypeRequired'
import { getOperationReturnTypeReferenceAst } from '../returnType/getReturnTypeReferenceAst'
import { EnhancedOperation } from '../typings'

export function getRequestTypeMethodSignatureAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TSMethodSignature {
  const { accessor } = context

  const parameters = isOperationInputTypeRequired(data, context)
    ? [typedIdAst('input', tsTypeReference(identifier(accessor.name(data.operation, 'operation-input-type'))))]
    : []
  const returnType = getOperationReturnTypeReferenceAst(data.operation, context)

  return tsMethodSignature(
    identifier(accessor.name(data.operation, 'operation')),
    undefined,
    parameters,
    tsTypeAnnotation(
      tsTypeReference(
        identifier('Promise'),
        tsTypeParameterInstantiation([
          tsTypeReference(identifier('HttpResponse'), tsTypeParameterInstantiation([returnType])),
        ]),
      ),
    ),
  )
}
