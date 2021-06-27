import { flatMap } from 'lodash'
import { OpenAPIObject } from 'openapi3-ts'
import { EnhancedOperation, hasRequestBody, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'
import { getRelativeImports } from '@oats-ts/typescript-common'

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
    if (hasRequestBody(data, context)) {
      imports.push(
        ...getRelativeImports(requestsPath, [
          [accessor.path(operation, 'operation-input-type'), accessor.name(operation, 'operation-input-type')],
        ]),
      )
    }
    imports.push(
      ...getRelativeImports(requestsPath, [
        [accessor.path(operation, 'operation-response-type'), accessor.name(operation, 'operation-response-type')],
      ]),
    )
    return imports
  })
}
