import { isNil, sortBy, values } from 'lodash'
import { ImportDeclaration } from 'typescript'
import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from '@oats-ts/json-schema-common'
import { FullTypeGuardGeneratorConfig, TypeGuardGeneratorContext } from './typings'
import { getModelImports } from '@oats-ts/typescript-common'

function getImportedRefs(
  data: SchemaObject | ReferenceObject,
  context: TypeGuardGeneratorContext,
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
    const name = nameOf(refTarget, context.produces)
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

  if (!isNil(data.items)) {
    return getImportedRefs(data.items, context, config, refs, level + 1)
  }
}

export function getTypeGuardImports(
  data: SchemaObject | ReferenceObject,
  context: TypeGuardGeneratorContext,
  config: FullTypeGuardGeneratorConfig,
): ImportDeclaration[] {
  const { dereference, nameOf, pathOf } = context
  const refs = new Set<ReferenceObject>()
  getImportedRefs(data, context, config, refs, 0)

  const importedSchemas = sortBy(
    Array.from(refs).map((ref) => dereference<SchemaObject>(ref)),
    (schema) => nameOf(schema, context.produces),
  )
  const path = pathOf(data, context.produces)
  return getModelImports(path, context.produces, importedSchemas, context)
}
