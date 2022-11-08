import { entries, isNil, values } from 'lodash'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { HasSchemas, JsonSchemaBasedGeneratorContext } from './types'
import { isReferenceObject } from './isReferenceObject'

function collectFromSchema(
  uri: string,
  input: Referenceable<SchemaObject>,
  context: JsonSchemaBasedGeneratorContext,
  discriminators: Record<string, string>,
): string | undefined {
  const schema = isReferenceObject(input) ? context.dereference<SchemaObject>(input) : input

  const { propertyName, mapping } = schema?.discriminator ?? {}
  if (!isNil(propertyName)) {
    const mappingEntries = entries(mapping ?? {})
    for (const [value, ref] of mappingEntries) {
      if (ref == uri && isNil(discriminators[propertyName])) {
        discriminators[propertyName] = value
        const parentUri = context.uriOf(schema)
        return parentUri
      }
    }
  }

  // TODO check for discriminators in nested objects, is it worth it???

  return undefined
}

function collectFromDocuments(
  uri: string,
  context: JsonSchemaBasedGeneratorContext,
  discriminators: Record<string, string>,
): string[] {
  const parents: Set<string> = new Set()
  for (const document of context.documents()) {
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
  context: JsonSchemaBasedGeneratorContext<D>,
): Record<string, string> {
  const schemaUri = context.uriOf(input)
  const discriminators: Record<string, string> = {}
  if (isNil(schemaUri)) {
    return discriminators
  }
  const visited: string[] = []
  const toVisit: string[] = collectFromDocuments(schemaUri, context, discriminators)

  while (toVisit.length !== 0) {
    const parentUri = toVisit.shift()
    if (isNil(parentUri)) {
      continue
    }
    const newParentUris = collectFromDocuments(parentUri, context, discriminators)
    const toVisitNew = newParentUris.filter((uri) => visited.indexOf(uri) < 0)
    visited.push(parentUri)
    toVisit.push(...toVisitNew)
  }

  return discriminators
}
