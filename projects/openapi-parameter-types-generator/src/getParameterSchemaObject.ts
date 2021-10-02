import { HeaderObject, ParameterObject } from '@oats-ts/openapi-model'
import { SchemaObject, ReferenceObject } from '@oats-ts/json-schema-model'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getParameterSchemaObject(
  params: (ParameterObject | HeaderObject)[],
  context: OpenAPIGeneratorContext,
): SchemaObject {
  const { nameOf } = context
  return {
    type: 'object',
    required: params.filter((param) => param.required).map((param) => (param as ParameterObject).name ?? nameOf(param)),
    properties: params.reduce(
      (props: Record<string, SchemaObject | ReferenceObject>, param: ParameterObject | HeaderObject) => {
        return Object.assign(props, {
          [(param as ParameterObject).name ?? nameOf(param)]: param.schema,
        })
      },
      {},
    ),
  }
}
