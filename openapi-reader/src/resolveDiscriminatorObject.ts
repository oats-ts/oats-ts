import { DiscriminatorObject, SchemaObject } from 'openapi3-ts'
import { ReadContext, ReadInput } from './types'
import { validate } from './validate'
import { entries, isNil } from '../../utils'
import { discriminatorObject } from './validators/discriminatorObject'
import { resolveReferenceUri } from './resolveReference'
import { resolveSchemaObject } from './resolveSchemaObject'
import { register } from './register'

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
