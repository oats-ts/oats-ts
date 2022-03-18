import { RequestBodyObject } from '@oats-ts/openapi-model'
import { Issue, object, optional, shape, literal, record, string } from '@oats-ts/validators'
import { append } from '../utils/append'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

const validator = object(
  shape<RequestBodyObject>(
    {
      content: object(record(string(), object())),
      required: optional(literal(true)),
    },
    true,
  ),
)

export function requestBodyObject(
  data: RequestBodyObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() => {
    const { dereference, uriOf } = context
    const { contentObject } = config
    return ordered(() => validator(data, uriOf(data), { append }))(() => contentObject(data.content, context, config))
  })
}
