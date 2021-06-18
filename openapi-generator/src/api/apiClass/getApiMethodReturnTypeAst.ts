import {
  identifier,
  TSTypeAnnotation,
  tsTypeAnnotation,
  tsTypeParameterInstantiation,
  tsTypeReference,
} from '@babel/types'
import { getOperationReturnTypeReferenceAst } from '../../operations/returnType/getReturnTypeReferenceAst'
import { EnhancedOperation } from '../../operations/typings'
import { OpenAPIGeneratorContext } from '../../typings'

export function getApiMethodReturnTypeAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): TSTypeAnnotation {
  return tsTypeAnnotation(
    tsTypeReference(
      identifier('Promise'),
      tsTypeParameterInstantiation([getOperationReturnTypeReferenceAst(data.operation, context)]),
    ),
  )
}
