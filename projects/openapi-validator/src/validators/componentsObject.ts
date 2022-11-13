import { ComponentsObject } from '@oats-ts/openapi-model'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { flatMap } from 'lodash'
import { parametersOf, requestBodiesOf, responsesOf, schemasOf } from '../utils/modelUtils'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'
import { structural } from '../structural'

export function componentsObject(
  data: ComponentsObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() =>
    ordered(() => structural.componentsObject(data, context.uriOf(data), validatorConfig))(
      () => flatMap(schemasOf(data, context), (schema) => referenceable(config.schemaObject)(schema, context, config)),
      () =>
        flatMap(parametersOf(data, context), (schema) =>
          referenceable(config.parameterObject)(schema, context, config),
        ),
      () =>
        flatMap(responsesOf(data, context), (schema) => referenceable(config.responseObject)(schema, context, config)),
      () =>
        flatMap(requestBodiesOf(data, context), (schema) =>
          referenceable(config.requestBodyObject)(schema, context, config),
        ),
    ),
  )
}
