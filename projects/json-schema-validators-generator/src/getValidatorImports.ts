import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from '@oats-ts/model-common'
import { isEmpty, entries, isNil, sortBy, values } from 'lodash'
import { getDiscriminators, RuntimePackages } from '@oats-ts/model-common'
import { getInferredType, JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { ImportDeclaration } from 'typescript'
import { ValidatorsGeneratorConfig } from './typings'
import { getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorTarget } from '@oats-ts/json-schema-common/lib/types'

export type ImportCollector = (
  data: SchemaObject | ReferenceObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
  level: number,
) => void

export function collectExternalReferenceImports(
  data: SchemaObject | ReferenceObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
  level: number,
): void {
  const { dereference, nameOf, uriOf } = context
  const schema = dereference(data)
  if (!isNil(nameOf(schema, 'json-schema/type-validator'))) {
    refs.add(uriOf(schema))
  } else {
    collectImports(schema, config, context, names, refs, level + 1)
  }
}

export function collectReferenceImports(
  data: ReferenceObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
  level: number,
): void {
  const { nameOf, dereference } = context
  if (!config.references && level > 0) {
    names.add(RuntimePackages.Validators.any)
  } else {
    const schema = dereference(data)
    if (!isNil(nameOf(schema, 'json-schema/type-validator'))) {
      names.add(RuntimePackages.Validators.lazy)
      refs.add(data.$ref)
    } else {
      collectImports(schema, config, context, names, refs, level + 1)
    }
  }
}

export function collectUnionImports(
  data: SchemaObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
  level: number,
): void {
  names.add(RuntimePackages.Validators.union)
  if (!isNil(data.discriminator)) {
    for (const schemaOrRef of data.oneOf) {
      collectImports(schemaOrRef, config, context, names, refs, level)
    }
    if (data.oneOf.length > 0) {
      names.add(RuntimePackages.Validators.lazy)
    }
  } else {
    for (const schemaOrRef of data.oneOf) {
      collectImports(schemaOrRef, config, context, names, refs, level)
    }
  }
}

export function collectRecordImports(
  data: SchemaObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
  level: number,
): void {
  names.add(RuntimePackages.Validators.object)
  if (config.records) {
    names.add(RuntimePackages.Validators.record)
    names.add(RuntimePackages.Validators.string)
    collectImports(data.additionalProperties as SchemaObject | ReferenceObject, config, context, names, refs, level + 1)
  }
}

export function collectObjectTypeImports(
  data: SchemaObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
  level: number,
): void {
  const discriminators = getDiscriminators(data, context)
  if (values(discriminators).length > 0) {
    names.add(RuntimePackages.Validators.literal)
  }
  names.add(RuntimePackages.Validators.object).add(RuntimePackages.Validators.shape)
  for (const [name, propSchema] of entries(data.properties)) {
    const isOptional = (data.required || []).indexOf(name) < 0
    if (isOptional) {
      names.add(RuntimePackages.Validators.optional)
    }
    collectImports(propSchema, config, context, names, refs, level + 1)
  }
}

export function collectArrayTypeImports(
  data: SchemaObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
  level: number,
): void {
  names.add(RuntimePackages.Validators.array)
  if (config.arrays) {
    names.add(RuntimePackages.Validators.items)
    return collectImports(data.items, config, context, names, refs, level + 1)
  }
}

export function collectImports(
  data: SchemaObject | ReferenceObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
  level: number,
): void {
  if (isReferenceObject(data)) {
    return collectReferenceImports(data, config, context, names, refs, level)
  }
  switch (getInferredType(data)) {
    case 'union':
      return collectUnionImports(data, config, context, names, refs, level)
    case 'enum':
      names.add(RuntimePackages.Validators.enumeration)
      return
    case 'string':
      names.add(RuntimePackages.Validators.string)
      return
    case 'number':
      names.add(RuntimePackages.Validators.number)
      return
    case 'boolean':
      names.add(RuntimePackages.Validators.boolean)
      return
    case 'record':
      return collectRecordImports(data, config, context, names, refs, level)
    case 'object':
      return collectObjectTypeImports(data, config, context, names, refs, level)
    case 'array':
      return collectArrayTypeImports(data, config, context, names, refs, level)
    default:
      names.add(RuntimePackages.Validators.any)
      return
  }
}

export function getValidatorImports(
  fromPath: string,
  schema: SchemaObject | ReferenceObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
  collector: ImportCollector = collectImports,
): ImportDeclaration[] {
  const { dereference } = context
  const nameSet = new Set<string>()
  const refSet = new Set<string>()
  collector(schema, config, context, nameSet, refSet, 0)
  const names = Array.from(nameSet)
  const refs = Array.from(refSet)
  return [
    ...(isEmpty(names)
      ? []
      : [
          getNamedImports(
            RuntimePackages.Validators.name,
            sortBy(names, (name) => name),
          ),
        ]),
    ...getModelImports<JsonSchemaGeneratorTarget>(
      fromPath,
      'json-schema/type-validator',
      refs.map((ref) => dereference<SchemaObject>(ref)),
      context,
    ),
  ]
}
