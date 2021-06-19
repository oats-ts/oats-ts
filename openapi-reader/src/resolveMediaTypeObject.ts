import { MediaTypeObject } from 'openapi3-ts'
import { register } from './register'
import { resolveReferenceable } from './resolveReferenceable'
import { resolveSchemaObject } from './resolveSchemaObject'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { mediaTypeObject } from './validators/mediaTypeObject'
import { isNil } from 'lodash'

export async function resolveMediaTypeObject(input: ReadInput<MediaTypeObject>, context: ReadContext): Promise<void> {
  if (!validate(input, context, mediaTypeObject)) {
    return
  }

  register(input, context)

  const { data, uri } = input
  const { schema, encoding } = data

  if (!isNil(schema)) {
    await resolveReferenceable({ data: schema, uri: context.uri.append(uri, 'schema') }, context, resolveSchemaObject)
  }

  if (!isNil(encoding)) {
    // TODO not dealing with this mess for now...
  }
}
