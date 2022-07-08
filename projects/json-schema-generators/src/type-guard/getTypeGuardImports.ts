import { isNil, sortBy, values } from 'lodash'
import { ImportDeclaration } from 'typescript'
import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { TypeGuardGeneratorConfig } from './typings'
import { getModelImports } from '@oats-ts/typescript-common'
import { isReferenceObject } from '@oats-ts/model-common'
import { JsonSchemaGeneratorContext } from '../types'

function getImportedRefs(
  data: Referenceable<SchemaObject>,
  context: JsonSchemaGeneratorContext,
  config: TypeGuardGeneratorConfig,
  refs: Set<ReferenceObject>,
  level: number,
): void {
  const { dereference, nameOf, uriOf } = context
  if (config.ignore(data, uriOf(data))) {
    return
  }
  if (isReferenceObject(data)) {
    const refTarget = dereference(data)
    const name = nameOf(refTarget, 'json-schema/type-guard')
    if (isNil(name)) {
      getImportedRefs(refTarget, context, config, refs, level)
    } else {
      refs.add(data)
    }
    return
  }

  if (Array.isArray(data.oneOf)) {
    for (const oneOfItemSchema of data.oneOf) {
      getImportedRefs(oneOfItemSchema, context, config, refs, level)
    }
    return
  }

  if (Array.isArray(data.allOf)) {
    for (const allOfItemSchema of data.allOf) {
      getImportedRefs(allOfItemSchema, context, config, refs, level)
    }
    return
  }

  if (!isNil(data.additionalProperties) && typeof data.additionalProperties !== 'boolean') {
    return getImportedRefs(data.additionalProperties, context, config, refs, level + 1)
  }

  if (!isNil(data.properties)) {
    for (const propSchema of values(data.properties)) {
      getImportedRefs(propSchema, context, config, refs, level + 1)
    }
    return
  }

  if (!isNil(data.prefixItems)) {
    return data.prefixItems.forEach((item) => getImportedRefs(item, context, config, refs, level + 1))
  }

  if (!isNil(data.items) && typeof data.items !== 'boolean') {
    return getImportedRefs(data.items, context, config, refs, level + 1)
  }
}

export function getTypeGuardImports(
  data: Referenceable<SchemaObject>,
  context: JsonSchemaGeneratorContext,
  config: TypeGuardGeneratorConfig,
): ImportDeclaration[] {
  const { dereference, nameOf, pathOf } = context
  const refs = new Set<ReferenceObject>()
  getImportedRefs(data, context, config, refs, 0)

  const importedSchemas = sortBy(
    Array.from(refs).map((ref) => dereference<SchemaObject>(ref)),
    (schema) => nameOf(schema, 'json-schema/type-guard'),
  )
  const path = pathOf(data, 'json-schema/type-guard')
  return isNil(path) ? [] : getModelImports(path, 'json-schema/type-guard', importedSchemas, context)
}
