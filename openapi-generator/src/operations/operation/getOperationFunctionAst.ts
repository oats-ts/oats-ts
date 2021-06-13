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
import { typedIdAst } from '../../common/babelUtils'
import { OpenAPIGeneratorContext } from '../../typings'
import { getOperationReturnTypeReferenceAst } from '../returnType/getReturnTypeReferenceAst'
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
      typedIdAst('config', tsTypeReference(identifier('RequestConfig'))),
      typedIdAst('input', tsTypeReference(identifier(accessor.name(operation, 'operation-input-type')))),
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
          tsTypeParameterInstantiation([getOperationReturnTypeReferenceAst(operation, context)]),
        ),
      ]),
    ),
  )

  return exportNamedDeclaration(fnAst)
}
