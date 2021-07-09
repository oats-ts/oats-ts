import { RequestBodyObject, ReferenceObject } from 'openapi3-ts'
import { Issue, object, optional, shape, literal, record, string } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../append'
import { validateContent } from '../content/validateContent'

const validator = object(
  shape<RequestBodyObject>(
    {
      content: object(record(string(), object())),
      required: optional(literal(true)),
    },
    true,
  ),
)

export const validateRequestBody = (
  data: RequestBodyObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
): Issue[] => {
  const { accessor } = context
  const requestBody = accessor.dereference(data)
  return [
    ...validator(requestBody, { append, path: accessor.uri(requestBody) }),
    ...validateContent(requestBody.content, context),
  ]
}
