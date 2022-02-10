import { isNil, sortBy, values } from 'lodash'
import { ImportDeclaration } from 'typescript'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { FullTypeGuardGeneratorConfig } from './typings'
import { getModelImports } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { isReferenceObject } from '@oats-ts/model-common'

function getImportedRefs(
  data: SchemaObject | ReferenceObject,
  context: JsonSchemaGeneratorContext,
  config: FullTypeGuardGeneratorConfig,
  refs: Set<ReferenceObject>,
  level: number,
): void {
  const { dereference, nameOf } = context
  if (isReferenceObject(data)) {
    if (!config.references && level > 0) {
      return
    }
    const refTarget = dereference(data)
    const name = nameOf(refTarget, 'json-schema/type-guard')
    if (isNil(name)) {
      getImportedRefs(refTarget, context, config, refs, level)
    } else {
      refs.add(data)
    }
    return
  }

  if (!isNil(data.oneOf) && !isNil(data.discriminator)) {
    for (const s of data.oneOf) {
      getImportedRefs(s, context, config, refs, level)
    }
    return
  }

  if (!isNil(data.additionalProperties) && typeof data.additionalProperties !== 'boolean') {
    return getImportedRefs(data.additionalProperties, context, config, refs, level + 1)
  }

  if (!isNil(data.properties)) {
    for (const s of values(data.properties)) {
      getImportedRefs(s, context, config, refs, level + 1)
    }
    return
  }

  if (!isNil(data.prefixItems)) {
    return data.prefixItems.forEach((item) => getImportedRefs(item, context, config, refs, level))
  }

  if (!isNil(data.items) && typeof data.items !== 'boolean') {
    return getImportedRefs(data.items, context, config, refs, level + 1)
  }
}

export function getTypeGuardImports(
  data: SchemaObject | ReferenceObject,
  context: JsonSchemaGeneratorContext,
  config: FullTypeGuardGeneratorConfig,
): ImportDeclaration[] {
  const { dereference, nameOf, pathOf } = context
  const refs = new Set<ReferenceObject>()
  getImportedRefs(data, context, config, refs, 0)

  const importedSchemas = sortBy(
    Array.from(refs).map((ref) => dereference<SchemaObject>(ref)),
    (schema) => nameOf(schema, 'json-schema/type-guard'),
  )
  const path = pathOf(data, 'json-schema/type-guard')
  return getModelImports(path, 'json-schema/type-guard', importedSchemas, context)
}
