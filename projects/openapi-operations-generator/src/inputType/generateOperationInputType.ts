import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { values, negate, isNil, flatMap } from 'lodash'
import { getRequestBodyContent, hasInput } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { getOperationInputBaseTypeAst } from './getOperationInputBaseTypeAst'
import { getOperationInputUnionTypeAst } from './getOperationInputUnionTypeAst'

export function generateOperationInputType(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): TypeScriptModule {
  if (!hasInput(data, context)) {
    return undefined
  }

  const { accessor } = context
  const { operation } = data

  const path = accessor.path(operation, 'openapi/input-type')
  const bodies = values(getRequestBodyContent(data, context))
    .map(({ schema }) => schema)
    .filter(negate(isNil))

  return {
    path,
    dependencies: [
      ...flatMap(bodies, (schema) => accessor.dependencies(path, schema, 'openapi/type')),
      ...accessor.dependencies(path, operation, 'openapi/path-type'),
      ...accessor.dependencies(path, operation, 'openapi/query-type'),
      ...accessor.dependencies(path, operation, 'openapi/headers-type'),
    ],
    content: [
      getOperationInputBaseTypeAst(data, context),
      ...(bodies.length > 1 ? [getOperationInputUnionTypeAst(data, context)] : []),
    ],
  }
}
