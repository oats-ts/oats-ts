import { ResponseObject } from 'openapi3-ts'
import { Issue, object, shape, combine, record, string } from '@oats-ts/validators'
import { append } from '../utils/append'
import { ignore } from '../utils/ignore'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

const validator = object(
  combine(
    shape<ResponseObject>(
      {
        content: object(record(string(), object())),
      },
      true,
    ),
    ignore(['links', 'headers']),
  ),
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
    return ordered(() => validator(data, { append, path: uriOf(data) }))(() =>
      contentObject(data.content, context, config),
    )
  })
}