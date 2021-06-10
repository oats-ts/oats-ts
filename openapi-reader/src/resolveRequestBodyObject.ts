import { RequestBodyObject } from 'openapi3-ts'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import isNil from 'lodash/isNil'
import { resolveContentObject } from './resolveContentObject'
import { requestBodyObject } from './validators/requestBodyObject'

export async function resolveRequestBodyObject(
  input: ReadInput<RequestBodyObject>,
  context: ReadContext,
): Promise<void> {
  if (!validate(input, context, requestBodyObject)) {
    return
  }
  const { data, uri } = input
  const { content } = data

  if (!isNil(content)) {
    await resolveContentObject({ data: content, uri: context.uri.append(uri, 'content') }, context)
  }

  register(input, context)
}
