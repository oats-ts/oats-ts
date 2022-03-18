import { ComponentsObject } from '@oats-ts/openapi-model'
import { Issue, object, optional, shape } from '@oats-ts/validators'
import { append } from '../utils/append'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { flatMap } from 'lodash'
import { parametersOf, requestBodiesOf, responsesOf, schemasOf } from '../utils/modelUtils'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'

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
    return ordered(() => validator(data, uriOf(data), { append }))(
      () => flatMap(schemasOf(data, context), (schema) => referenceable(schemaObject)(schema, context, config)),
      () => flatMap(parametersOf(data, context), (schema) => referenceable(parameterObject)(schema, context, config)),
      () => flatMap(responsesOf(data, context), (schema) => referenceable(responseObject)(schema, context, config)),
      () =>
        flatMap(requestBodiesOf(data, context), (schema) => referenceable(requestBodyObject)(schema, context, config)),
    )
  })
}
