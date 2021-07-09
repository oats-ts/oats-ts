import { ResponseObject, ReferenceObject } from 'openapi3-ts'
import { Issue, object, shape, combine, record, string } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../append'
import { validateContent } from '../content/validateContent'
import { ignore } from '../ignore'

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

export const validateResponse = (data: ResponseObject | ReferenceObject, context: OpenAPIGeneratorContext): Issue[] => {
  const { accessor } = context
  const response = accessor.dereference(data)
  return [
    ...validator(response, { append, path: accessor.uri(response) }),
    ...validateContent(response.content, context),
  ]
}
