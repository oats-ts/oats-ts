import { HeaderObject, ResponseObject } from '@oats-ts/openapi-model'
import { register } from './register'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { resolveReferenceable } from './resolveReferenceable'
import { resolveHeaderObject } from './resolveParameterObject'
import { responseObject } from './validators/responseObject'
import { resolveContentObject } from './resolveContentObject'
import { entries, isNil } from 'lodash'
import { registerNamed } from './registerNamed'

export async function resolveResponseObject(input: ReadInput<ResponseObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, responseObject)) {
    return
  }
  const { data, uri } = input
  const { content, headers } = data

  if (!isNil(headers)) {
    for (const [name, headerOrRef] of entries(headers)) {
      await resolveReferenceable<HeaderObject>(
        { data: headerOrRef, uri: context.uri.append(uri, 'headers', name) },
        context,
        resolveHeaderObject,
      )
      registerNamed(name, headerOrRef, context)
    }
  }

  if (!isNil(content)) {
    await resolveContentObject({ data: content, uri: context.uri.append(uri, 'content') }, context)
  }

  register(input, context)
}
