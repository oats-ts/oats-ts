import { ParameterObject } from '@oats-ts/openapi-model'
import { SchemaObject, ReferenceObject } from '@oats-ts/json-schema-model'

export function getParameterSchemaObject(params: ParameterObject[]): SchemaObject {
  return {
    type: 'object',
    required: params.filter((param) => param.required).map((param) => param.name),
    properties: params.reduce(
      (props: Record<string, SchemaObject | ReferenceObject>, param: ParameterObject) =>
        Object.assign(props, {
          [param.name]: param.schema,
        }),
      {},
    ),
  }
}
