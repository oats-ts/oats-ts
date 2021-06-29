import { flatMap } from 'lodash'
import { OpenAPIObject } from 'openapi3-ts'
import { EnhancedOperation, hasInput, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'
import { getRelativeImports, getNamedImports } from '@oats-ts/typescript-common'

export function getApiTypeImports(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
): ImportDeclaration[] {
  const { accessor } = context
  const apiPath = accessor.path(doc, 'api-type')

  const imports = flatMap(operations, (data) => {
    const { operation } = data
    const imports: ImportDeclaration[] = []
    if (hasInput(data, context)) {
      imports.push(
        ...getRelativeImports(apiPath, [
          [accessor.path(operation, 'operation-input-type'), accessor.name(operation, 'operation-input-type')],
        ]),
      )
    }
    imports.push(
      ...getRelativeImports(apiPath, [
        [accessor.path(operation, 'operation-response-type'), accessor.name(operation, 'operation-response-type')],
      ]),
    )
    return imports
  })
  return operations.length > 0
    ? [...imports, getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.RequestConfig])]
    : imports
}
