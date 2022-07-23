import { RequestBodyObject } from '@oats-ts/openapi-model'
import {
  Issue,
  object,
  optional,
  shape,
  literal,
  record,
  string,
  ShapeInput,
  combine,
  restrictKeys,
} from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

const requestBodyShape: ShapeInput<RequestBodyObject> = {
  description: optional(string()),
  content: object(record(string(), object())),
  required: optional(literal(true)),
}
const validator = object(
  combine(shape<RequestBodyObject>(requestBodyShape), restrictKeys(Object.keys(requestBodyShape))),
)

export function requestBodyObject(
  data: RequestBodyObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() =>
    ordered(() => validator(data, context.uriOf(data), validatorConfig))(() =>
      config.contentObject(data.content ?? {}, context, config),
    ),
  )
}
