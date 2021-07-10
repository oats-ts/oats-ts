import { isNil, sortBy, values, flatMap } from 'lodash'
import { ImportDeclaration } from 'typescript'
import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { FullTypeGuardGeneratorConfig } from './typings'

function getImportedRefs(
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: FullTypeGuardGeneratorConfig,
  refs: Set<string>,
): void {
  if (isReferenceObject(data)) {
    if (config.references) {
      refs.add(data.$ref)
    }
    return
  }

  if (!isNil(data.oneOf)) {
    if (config.references) {
      for (const s of data.oneOf) {
        getImportedRefs(s, context, config, refs)
      }
    }
    if (config.unionReferences) {
      for (const s of data.oneOf) {
        if (isReferenceObject(s)) {
          refs.add(s.$ref)
        }
      }
    }
    return
  }

  if (!isNil(data.additionalProperties) && typeof data.additionalProperties !== 'boolean') {
    return getImportedRefs(data.additionalProperties, context, config, refs)
  }

  if (!isNil(data.properties)) {
    for (const s of values(data.properties)) {
      getImportedRefs(s, context, config, refs)
    }
    return
  }

  if (!isNil(data.items)) {
    return getImportedRefs(data.items, context, config, refs)
  }
}

export function getTypeGuardImports(
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: FullTypeGuardGeneratorConfig,
): ImportDeclaration[] {
  const { dereference, nameOf, pathOf, dependenciesOf } = context
  const refs = new Set<string>()
  getImportedRefs(data, context, config, refs)
  const importedSchemas = sortBy(
    Array.from(refs).map((ref) => dereference<SchemaObject>(ref)),
    (schema) => nameOf(schema, 'openapi/type-guard'),
  )
  const path = pathOf(data, 'openapi/type-guard')
  return flatMap(importedSchemas, (schema) => dependenciesOf(path, schema, 'openapi/type-guard'))
}
