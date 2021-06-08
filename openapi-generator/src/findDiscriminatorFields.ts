import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { isNil, entries, values } from '../../utils'
import { SchemaContext } from './schemas/types'

function collectFromSchema(
  uri: string,
  input: SchemaObject | ReferenceObject,
  context: SchemaContext,
  discriminators: Record<string, string>,
): string {
  const schema = isReferenceObject(input) ? context.utils.dereference<SchemaObject>(input) : input

  if (!isNil(schema.discriminator)) {
    const { propertyName, mapping } = schema.discriminator
    const mappingEntries = entries(mapping || {})
    for (const [value, ref] of mappingEntries) {
      if (ref == uri) {
        discriminators[propertyName] = value
        const parentUri = context.utils.uriOf(schema)
        return parentUri
      }
    }
  }

  // TODO check for discriminators in nested objects, is it worth it???

  return null
}

function collectFromDocuments(uri: string, context: SchemaContext, discriminators: Record<string, string>): string[] {
  const parents: Set<string> = new Set()
  for (const document of Array.from(context.documents.values())) {
    for (const schema of values(document?.components?.schemas || {})) {
      const parentUri = collectFromSchema(uri, schema, context, discriminators)
      if (!isNil(parentUri)) {
        parents.add(parentUri)
      }
    }
  }
  return Array.from(parents)
}

export function findDiscriminatorFields(input: SchemaObject, context: SchemaContext): Record<string, string> {
  const schemaUri = context.utils.uriOf(input)
  const discriminators: Record<string, string> = {}
  const visited: string[] = []
  const toVisit: string[] = collectFromDocuments(schemaUri, context, discriminators)

  while (toVisit.length !== 0) {
    const parentUri = toVisit.shift()
    const newParentUris = collectFromDocuments(parentUri, context, discriminators)
    const toVisitNew = newParentUris.filter((uri) => !visited.includes(uri))
    visited.push(parentUri)
    toVisit.push(...toVisitNew)
  }

  return discriminators
}
