import { ImportDeclaration } from '@babel/types'
import { flatMap, values } from 'lodash'
import { OpenAPIObject } from 'openapi3-ts'
import { getImports } from '../../common/getImports'
import { OpenAPIGeneratorContext } from '../../typings'
import { isOperationInputTypeRequired } from '../inputType/isOperationInputTypeRequired'
import { getOperationReturnTypeImports } from '../returnType/getOperationReturnTypeImports'
import { getResponseMap } from '../returnType/getResponseMap'
import { EnhancedOperation } from '../typings'

export function getRequestsTypeImports(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  const requestsPath = accessor.path(doc, 'requests-type')

  return flatMap(operations, (data) => {
    const { operation } = data
    const imports: ImportDeclaration[] = []
    if (isOperationInputTypeRequired(data, context)) {
      imports.push(
        ...getImports(requestsPath, [
          [accessor.path(operation, 'operation-input-type'), accessor.name(operation, 'operation-input-type')],
        ]),
      )
    }
    imports.push(
      ...getImports(requestsPath, [
        [accessor.path(operation, 'operation-return-type'), accessor.name(operation, 'operation-return-type')],
      ]),
    )
    return imports
  })
}
