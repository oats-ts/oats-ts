import {
  blockStatement,
  ExportNamedDeclaration,
  exportNamedDeclaration,
  functionDeclaration,
  identifier,
  returnStatement,
  tsTypeAnnotation,
  tsTypeParameterInstantiation,
  tsTypeReference,
} from '@babel/types'
import { typedId } from '../../babelUtils'
import { OpenAPIGeneratorContext } from '../../typings'
import { getOperationReturnTypeReference } from '../returnType/generateOperationReturnType'
import { EnhancedOperation } from '../typings'
import { getOperationParseAst } from './getOperationParseAst'

export function getOperationFunctionAst(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ExportNamedDeclaration {
  const { accessor } = context
  const { operation } = data

  const fnAst = functionDeclaration(
    identifier(accessor.name(operation, 'operation')),
    [
      typedId('config', tsTypeReference(identifier('RequestConfig'))),
      typedId('input', tsTypeReference(identifier(accessor.name(operation, 'operation-input-type')))),
    ],
    blockStatement([returnStatement(getOperationParseAst(data, context))]),
    false,
    true,
  )

  fnAst.returnType = tsTypeAnnotation(
    tsTypeReference(
      identifier('Promise'),
      tsTypeParameterInstantiation([
        tsTypeReference(
          identifier('HttpResponse'),
          tsTypeParameterInstantiation([getOperationReturnTypeReference(operation, context)]),
        ),
      ]),
    ),
  )

  return exportNamedDeclaration(fnAst)
}
