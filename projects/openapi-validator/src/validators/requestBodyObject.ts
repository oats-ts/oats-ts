import { RequestBodyObject } from 'openapi3-ts'
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
    return ordered(() => validator(data, { append, path: uriOf(data) }))(() =>
      contentObject(data.content, context, config),
    )
  })
}
