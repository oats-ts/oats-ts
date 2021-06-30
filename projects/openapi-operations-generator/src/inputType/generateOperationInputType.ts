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

  const path = accessor.path(operation, 'operation-input-type')
  const bodies = values(getRequestBodyContent(data, context))
    .map(({ schema }) => schema)
    .filter(negate(isNil))

  return {
    path,
    dependencies: [
      ...flatMap(bodies, (schema) => accessor.dependencies(path, schema, 'type')),
      ...accessor.dependencies(path, operation, 'operation-path-type'),
      ...accessor.dependencies(path, operation, 'operation-query-type'),
      ...accessor.dependencies(path, operation, 'operation-headers-type'),
    ],
    content: [
      getOperationInputBaseTypeAst(data, context),
      ...(bodies.length > 1 ? [getOperationInputUnionTypeAst(data, context)] : []),
    ],
  }
}
