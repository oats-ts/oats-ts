import { flatMap } from 'lodash'
import { OpenAPIObject } from 'openapi3-ts'
import { isOperationInputTypeRequired } from '../../operations/inputType/isOperationInputTypeRequired'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'
import { tsRelativeImports } from '../../common/typeScriptUtils'

export function getApiTypeImports(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  const requestsPath = accessor.path(doc, 'api-type')

  return flatMap(operations, (data) => {
    const { operation } = data
    const imports: ImportDeclaration[] = []
    if (isOperationInputTypeRequired(data, context)) {
      imports.push(
        ...tsRelativeImports(requestsPath, [
          [accessor.path(operation, 'operation-input-type'), accessor.name(operation, 'operation-input-type')],
        ]),
      )
    }
    imports.push(
      ...tsRelativeImports(requestsPath, [
        [accessor.path(operation, 'operation-response-type'), accessor.name(operation, 'operation-response-type')],
      ]),
    )
    return imports
  })
}
