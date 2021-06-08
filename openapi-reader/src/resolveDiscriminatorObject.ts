import { DiscriminatorObject, SchemaObject } from 'openapi3-ts'
import { ReadContext, ReadInput } from './internalTypings'
import { validate } from './validate'
import { discriminatorObject } from './validators/discriminatorObject'
import { resolveReferenceUri } from './resolveReference'
import { resolveSchemaObject } from './resolveSchemaObject'
import { register } from './register'
import isNil from 'lodash/isNil'
import entries from 'lodash/entries'

export async function resolveDiscriminatorObject(
  input: ReadInput<DiscriminatorObject>,
  context: ReadContext,
): Promise<void> {
  if (!validate(input, context, discriminatorObject)) {
    return
  }

  register(input, context)

  const { data, uri } = input
  const { mapping } = data

  if (!isNil(mapping)) {
    for (const [key, ref] of entries(mapping)) {
      const refInput = await resolveReferenceUri<SchemaObject>(
        { data: ref, uri: context.uri.append(uri, 'mapping', key) },
        context,
      )
      await resolveSchemaObject(refInput, context)
      mapping[key] = refInput.uri
    }
  }
}
