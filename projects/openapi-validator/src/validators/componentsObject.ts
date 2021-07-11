import { ComponentsObject } from 'openapi3-ts'
import { Issue, object, optional, shape } from '@oats-ts/validators'
import { append } from '../utils/append'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { flatMap } from 'lodash'
import { parametersOf, requestBodiesOf, responsesOf, schemasOf } from '../utils/modelUtils'
import { ifNotValidated } from '../utils/ifNotValidated'

const validator = object(
  shape<ComponentsObject>({
    schemas: optional(object()),
    responses: optional(object()),
    parameters: optional(object()),
    requestBodies: optional(object()),
  }),
)

export function componentsObject(
  data: ComponentsObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() => {
    const { uriOf } = context
    const { schemaObject, parameterObject, responseObject, requestBodyObject } = config
    return ordered(() => validator(data, { append, path: uriOf(data) }))(
      () => flatMap(schemasOf(data, context), (schema) => schemaObject(schema, context, config)),
      () => flatMap(parametersOf(data, context), (schema) => parameterObject(schema, context, config)),
      () => flatMap(responsesOf(data, context), (schema) => responseObject(schema, context, config)),
      () => flatMap(requestBodiesOf(data, context), (schema) => requestBodyObject(schema, context, config)),
    )
  })
}
