import { ParameterObject, ReferenceObject, SchemaObject } from 'openapi3-ts'

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
