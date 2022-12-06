import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { entries, isNil } from 'lodash'
import { getAllSchemaObjects } from './getAllSchemaObjects'
import { OpenAPIGeneratorContext } from './typings'

export function getDiscriminators(
  input: Referenceable<SchemaObject>,
  context: OpenAPIGeneratorContext,
  schemas: SchemaObject[] = getAllSchemaObjects(context),
): Record<string, string> {
  const uri = context.uriOf(input)
  const discriminators: Record<string, string> = {}
  for (let i = 0; i < schemas.length; i += 1) {
    const schema = schemas[i]
    if (
      schema === input ||
      isNil(schema.oneOf) ||
      isNil(schema.discriminator) ||
      isNil(schema.discriminator.propertyName)
    ) {
      continue
    }

    const { propertyName, mapping } = schema.discriminator
    const hasInput = schema.oneOf.map((ref) => context.dereference(ref)).some((schema) => schema === input)

    if (!hasInput) {
      continue
    }

    const name = context.nameOf(input)

    if (!isNil(name)) {
      discriminators[propertyName] = name
    }

    const mappingEntries = entries(mapping ?? {})
    for (const [value, ref] of mappingEntries) {
      if (ref === uri && isNil(discriminators[propertyName])) {
        discriminators[propertyName] = value
      }
    }
  }
  return discriminators
}
