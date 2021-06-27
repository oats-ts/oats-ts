import { entries, isNil, values } from 'lodash'
import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from './typings'

function collectFromSchema(
  uri: string,
  input: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  discriminators: Record<string, string>,
): string {
  const { accessor } = context
  const schema = isReferenceObject(input) ? accessor.dereference<SchemaObject>(input) : input

  if (!isNil(schema.discriminator)) {
    const { propertyName, mapping } = schema.discriminator
    const mappingEntries = entries(mapping || {})
    for (const [value, ref] of mappingEntries) {
      if (ref == uri) {
        discriminators[propertyName] = value
        const parentUri = accessor.uri(schema)
        return parentUri
      }
    }
  }

  // TODO check for discriminators in nested objects, is it worth it???

  return null
}

function collectFromDocuments(
  uri: string,
  context: OpenAPIGeneratorContext,
  discriminators: Record<string, string>,
): string[] {
  const { accessor } = context
  const parents: Set<string> = new Set()
  for (const document of accessor.documents()) {
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
export function getDiscriminators(input: SchemaObject, context: OpenAPIGeneratorContext): Record<string, string> {
  const { accessor } = context
  const schemaUri = accessor.uri(input)
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
