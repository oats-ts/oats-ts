import { isNil, sortBy, values } from 'lodash'
import { ImportDeclaration } from 'typescript'
import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { tsModelImportAsts } from '../common/typeScriptUtils'
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
  const { accessor } = context
  const refs = new Set<string>()
  getImportedRefs(data, context, config, refs)
  const importedSchemas = sortBy(
    Array.from(refs).map((ref) => accessor.dereference<SchemaObject>(ref)),
    (schema) => accessor.name(schema, 'type-guard'),
  )
  return tsModelImportAsts(accessor.path(data, 'type-guard'), 'type-guard', importedSchemas, context)
}
