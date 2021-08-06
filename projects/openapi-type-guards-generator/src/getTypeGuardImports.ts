import { isNil, sortBy, values } from 'lodash'
import { ImportDeclaration } from 'typescript'
import { isReferenceObject, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { FullTypeGuardGeneratorConfig } from './typings'
import { getModelImports } from '../../typescript-common/lib'

function getImportedRefs(
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
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
    const name = nameOf(refTarget, 'openapi/type-guard')
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
  context: OpenAPIGeneratorContext,
  config: FullTypeGuardGeneratorConfig,
): ImportDeclaration[] {
  const { dereference, nameOf, pathOf } = context
  const refs = new Set<ReferenceObject>()
  getImportedRefs(data, context, config, refs, 0)

  const importedSchemas = sortBy(
    Array.from(refs).map((ref) => dereference<SchemaObject>(ref)),
    (schema) => nameOf(schema, 'openapi/type-guard'),
  )
  const path = pathOf(data, 'openapi/type-guard')
  return getModelImports(path, 'openapi/type-guard', importedSchemas, context)
}
