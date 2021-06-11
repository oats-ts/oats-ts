import {
  blockStatement,
  exportNamedDeclaration,
  functionDeclaration,
  identifier,
  returnStatement,
  tsTypeAnnotation,
  tsTypeParameterInstantiation,
  tsTypeReference,
} from '@babel/types'
import { OperationObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import type { HttpMethod } from '@oats-ts/http'
import { BabelModule } from '../../../babel-writer/lib'
import { getOperationReturnTypeImports, getOperationReturnTypeReference } from './generateOperationReturnType'

export function generateOperationFunction(
  url: string,
  method: HttpMethod,
  data: OperationObject,
  context: OpenAPIGeneratorContext,
): BabelModule {
  const { accessor } = context

  const inputParameter = identifier('input')
  inputParameter.typeAnnotation = tsTypeAnnotation(
    tsTypeReference(identifier(accessor.name(data, 'operation-input-type'))),
  )

  const fn = functionDeclaration(
    identifier(data.operationId),
    [inputParameter],
    blockStatement([returnStatement(identifier('undefined'))]),
    false,
    true,
  )
  fn.returnType = tsTypeAnnotation(
    tsTypeReference(
      identifier('Promise'),
      tsTypeParameterInstantiation([getOperationReturnTypeReference(data, context)]),
    ),
  )
  const ast = exportNamedDeclaration(fn)
  return {
    imports: [...getOperationReturnTypeImports(data, context)],
    path: accessor.path(data, 'operation'),
    statements: [ast],
  }
}
