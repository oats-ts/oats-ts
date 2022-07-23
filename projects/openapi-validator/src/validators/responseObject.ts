import { ResponseObject } from '@oats-ts/openapi-model'
import { Issue, object, shape, combine, record, string, optional, ShapeInput, restrictKeys } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

const responseShape: ShapeInput<ResponseObject> = {
  content: object(record(string(), object())),
  headers: optional(object(record(string(), object()))),
  description: optional(string()),
}
const validator = object(combine(shape<ResponseObject>(responseShape), restrictKeys(Object.keys(responseShape))))

export function responseObject(
  data: ResponseObject,
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
