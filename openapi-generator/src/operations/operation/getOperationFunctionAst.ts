import {
  blockStatement,
  ExportNamedDeclaration,
  exportNamedDeclaration,
  functionDeclaration,
  Identifier,
  identifier,
  returnStatement,
  tsTypeAnnotation,
  tsTypeParameterInstantiation,
  tsTypeReference,
} from '@babel/types'
import { typedIdAst } from '../../common/babelUtils'
import { OpenAPIGeneratorContext } from '../../typings'
import { isOperationInputTypeRequired } from '../inputType/isOperationInputTypeRequired'
import { getOperationReturnTypeReferenceAst } from '../returnType/getReturnTypeReferenceAst'
import { EnhancedOperation } from '../typings'
import { getOperationParseAst } from './getOperationParseAst'

export function getOperationFunctionAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ExportNamedDeclaration {
  const { accessor } = context
  const { operation } = data

  const params: Identifier[] = []

  if (isOperationInputTypeRequired(data, context)) {
    params.push(typedIdAst('input', tsTypeReference(identifier(accessor.name(operation, 'operation-input-type')))))
  }

  params.push(typedIdAst('config', tsTypeReference(identifier('RequestConfig'))))

  const fnAst = functionDeclaration(
    identifier(accessor.name(operation, 'operation')),
    params,
    blockStatement([returnStatement(getOperationParseAst(data, context))]),
    false,
    true,
  )

  fnAst.returnType = tsTypeAnnotation(
    tsTypeReference(
      identifier('Promise'),
      tsTypeParameterInstantiation([getOperationReturnTypeReferenceAst(operation, context)]),
    ),
  )

  return exportNamedDeclaration(fnAst)
}
