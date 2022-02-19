import { entries, isNil, values } from 'lodash'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { GeneratorContext, HasSchemas } from './types'
import { isReferenceObject } from './isReferenceObject'

function collectFromSchema(
  uri: string,
  input: Referenceable<SchemaObject>,
  context: GeneratorContext,
  discriminators: Record<string, string>,
): string {
  const { dereference, uriOf } = context
  const schema = isReferenceObject(input) ? dereference<SchemaObject>(input) : input

  if (!isNil(schema.discriminator)) {
    const { propertyName, mapping } = schema.discriminator
    const mappingEntries = entries(mapping || {})
    for (const [value, ref] of mappingEntries) {
      if (ref == uri && isNil(discriminators[propertyName])) {
        discriminators[propertyName] = value
        const parentUri = uriOf(schema)
        return parentUri
      }
    }
  }

  // TODO check for discriminators in nested objects, is it worth it???

  return null
}

function collectFromDocuments(
  uri: string,
  context: GeneratorContext,
  discriminators: Record<string, string>,
): string[] {
  const { documents } = context
  const parents: Set<string> = new Set()
  for (const document of documents) {
    for (const schema of values(document?.components?.schemas || {})) {
      const parentUri = collectFromSchema(uri, schema, context, discriminators)
      if (!isNil(parentUri)) {
        parents.add(parentUri)
      }
    }
  }
  return Array.from(parents)
}

/** @returns Discriminators in a propertyName -> value format */
export function getDiscriminators<D extends HasSchemas>(
  input: Referenceable<SchemaObject>,
  context: GeneratorContext<D>,
): Record<string, string> {
  const { uriOf } = context
  const schemaUri = uriOf(input)
  const discriminators: Record<string, string> = {}
  const visited: string[] = []
  const toVisit: string[] = collectFromDocuments(schemaUri, context, discriminators)

  while (toVisit.length !== 0) {
    const parentUri = toVisit.shift()
    const newParentUris = collectFromDocuments(parentUri, context, discriminators)
    const toVisitNew = newParentUris.filter((uri) => visited.indexOf(uri) < 0)
    visited.push(parentUri)
    toVisit.push(...toVisitNew)
  }

  return discriminators
}
