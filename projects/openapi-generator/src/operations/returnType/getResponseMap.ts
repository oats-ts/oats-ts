import { values, isNil, entries } from 'lodash'
import { OperationObject, ReferenceObject, ResponseObject, SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'

export function getResponseMap(
  operation: OperationObject,
  context: OpenAPIGeneratorContext,
): Record<string, SchemaObject> {
  const { accessor } = context
  const schemas: Record<string, SchemaObject> = {}
  for (const [rawStatus, resOrRef] of entries(operation.responses || {}) as [
    string,
    ReferenceObject | ResponseObject,
  ][]) {
    const repsonse = accessor.dereference(resOrRef)
    for (const mediaTypeObj of values(repsonse.content || {})) {
      if (!isNil(mediaTypeObj.schema)) {
        schemas[rawStatus] = accessor.dereference(mediaTypeObj.schema)
      }
    }
  }
  return schemas
}
