import { values, isNil } from 'lodash'
import { OperationObject, ReferenceObject, ResponseObject, SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'

export function getResponseSchemas(operation: OperationObject, context: OpenAPIGeneratorContext): SchemaObject[] {
  const { accessor } = context
  const schemas: SchemaObject[] = []
  for (const resOrRef of values(operation.responses || {}) as (ResponseObject | ReferenceObject)[]) {
    const repsonse = accessor.dereference(resOrRef)
    for (const mediaTypeObj of values(repsonse.content || {})) {
      if (!isNil(mediaTypeObj.schema)) {
        schemas.push(accessor.dereference(mediaTypeObj.schema))
      }
    }
  }
  return schemas
}
