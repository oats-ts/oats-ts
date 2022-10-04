import { flatMap } from 'lodash'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { EnhancedOperation, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'

export function getSdkTypeImports(
  doc: OpenAPIObject,
  operations: EnhancedOperation[],
  context: OpenAPIGeneratorContext,
  params: boolean,
): ImportDeclaration[] {
  const apiPath = context.pathOf(doc, 'oats/sdk-type')
  const imports = flatMap(operations, (data) => [
    ...(params ? context.dependenciesOf(apiPath, data.operation, 'oats/request-type') : []),
    ...context.dependenciesOf(apiPath, data.operation, 'oats/response-type'),
  ])
  return operations.length > 0 ? [...imports] : imports
}
