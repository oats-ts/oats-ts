import { ResponseObject } from '@oats-ts/openapi-model'
import { Issue, object, shape, combine, record, string, optional } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { ignore } from '../utils/ignore'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

const validator = object(
  combine([
    shape<ResponseObject>(
      {
        content: object(record(string(), object())),
        headers: optional(object(record(string(), object()))),
      },
      true,
    ),
    ignore(['links']),
  ]),
)

export function responseObject(
  data: ResponseObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() => {
    const { uriOf } = context
    const { contentObject } = config
    return ordered(() => validator(data, uriOf(data), validatorConfig))(() =>
      contentObject(data.content, context, config),
    )
  })
}
