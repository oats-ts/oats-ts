import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { getInferredType, isReferenceObject } from '@oats-ts/model-common'
import { isEmpty, entries, isNil, sortBy, values } from 'lodash'
import { getDiscriminators, RuntimePackages } from '@oats-ts/model-common'
import { ImportDeclaration } from 'typescript'
import { ValidatorsGeneratorConfig } from './typings'
import { getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext, JsonSchemaGeneratorTarget, TraversalHelper } from '../types'

export type ImportCollector = (
  data: Referenceable<SchemaObject>,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  helper: TraversalHelper,
  names: Set<string>,
  refs: Set<string>,
) => void

export function collectExternalReferenceImports(
  data: Referenceable<SchemaObject>,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  helper: TraversalHelper,
  names: Set<string>,
  refs: Set<string>,
): void {
  const schema = context.dereference(data)
  if (!isNil(context.nameOf(schema))) {
    names.add(RuntimePackages.Validators.lazy)
    refs.add(context.uriOf(schema))
  } else {
    collectImports(schema, config, context, helper, names, refs)
  }
}

export function collectReferenceImports(
  data: ReferenceObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  helper: TraversalHelper,
  names: Set<string>,
  refs: Set<string>,
): void {
  const schema = context.dereference(data)
  if (!isNil(context.nameOf(schema, 'oats/type-validator'))) {
    names.add(RuntimePackages.Validators.lazy)
    refs.add(data.$ref)
  } else {
    collectImports(schema, config, context, helper, names, refs)
  }
}

export function collectUnionImports(
  data: SchemaObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  helper: TraversalHelper,
  names: Set<string>,
  refs: Set<string>,
): void {
  names.add(RuntimePackages.Validators.union)
  if (!isNil(data.discriminator)) {
    for (const schemaOrRef of data.oneOf ?? []) {
      collectImports(schemaOrRef, config, context, helper, names, refs)
    }
    if ((data.oneOf?.length ?? 0) > 0) {
      names.add(RuntimePackages.Validators.lazy)
    }
  } else {
    for (const schemaOrRef of data.oneOf ?? []) {
      collectImports(schemaOrRef, config, context, helper, names, refs)
    }
  }
}

export function collectIntersectionImports(
  data: SchemaObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  helper: TraversalHelper,
  names: Set<string>,
  refs: Set<string>,
): void {
  names.add(RuntimePackages.Validators.combine)
  for (const schemaOrRef of data.allOf ?? []) {
    collectImports(schemaOrRef, config, context, helper, names, refs)
  }
}

export function collectRecordImports(
  data: SchemaObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  helper: TraversalHelper,
  names: Set<string>,
  refs: Set<string>,
): void {
  names.add(RuntimePackages.Validators.object)
  if (!config.ignore(data.additionalProperties as Referenceable<SchemaObject>, helper)) {
    names.add(RuntimePackages.Validators.record)
    names.add(RuntimePackages.Validators.string)
    collectImports(data.additionalProperties as Referenceable<SchemaObject>, config, context, helper, names, refs)
  }
}

export function collectObjectTypeImports(
  data: SchemaObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  helper: TraversalHelper,
  names: Set<string>,
  refs: Set<string>,
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
    collectImports(propSchema, config, context, helper, names, refs)
  }
}

export function collectArrayTypeImports(
  data: SchemaObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  helper: TraversalHelper,
  names: Set<string>,
  refs: Set<string>,
): void {
  names.add(RuntimePackages.Validators.array)
  if (!config.ignore(data.items as Referenceable<SchemaObject>, helper)) {
    names.add(RuntimePackages.Validators.items)
    collectImports(data.items as Referenceable<SchemaObject>, config, context, helper, names, refs)
  }
}

export function collectTupleImports(
  data: SchemaObject,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  helper: TraversalHelper,
  names: Set<string>,
  refs: Set<string>,
): void {
  const { prefixItems = [], minItems = 0 } = data
  if (minItems < prefixItems.length) {
    names.add(RuntimePackages.Validators.optional)
  }
  names.add(RuntimePackages.Validators.array)
  names.add(RuntimePackages.Validators.tuple)
  return prefixItems.forEach((item) => collectImports(item, config, context, helper, names, refs))
}

export function collectLiteralImports(data: any, names: Set<string>): void {
  if (data === null || typeof data === 'number' || typeof data === 'boolean' || typeof data === 'string') {
    names.add(RuntimePackages.Validators.literal)
  } else if (Array.isArray(data)) {
    names.add(RuntimePackages.Validators.array).add(RuntimePackages.Validators.tuple)
    data.forEach((item: any) => collectLiteralImports(item, names))
  } else if (typeof data === 'object') {
    names.add(RuntimePackages.Validators.object).add(RuntimePackages.Validators.shape)
    values(data).forEach((item) => collectLiteralImports(item, names))
  } else {
    names.add(RuntimePackages.Validators.any)
  }
}

export function collectImports(
  data: Referenceable<SchemaObject>,
  config: ValidatorsGeneratorConfig,
  context: JsonSchemaGeneratorContext,
  helper: TraversalHelper,
  names: Set<string>,
  refs: Set<string>,
): void {
  const type = getInferredType(data)
  if (config.ignore(data, helper)) {
    names.add(RuntimePackages.Validators.any)
    return
  }
  if (isReferenceObject(data)) {
    return collectReferenceImports(data, config, context, helper, names, refs)
  }
  switch (type) {
    case 'union':
      return collectUnionImports(data, config, context, helper, names, refs)
    case 'intersection':
      return collectIntersectionImports(data, config, context, helper, names, refs)
    case 'enum': {
      names.add(RuntimePackages.Validators.union)
      data.enum?.forEach((value) => collectLiteralImports(value, names))
      return
    }
    case 'literal':
      collectLiteralImports(data.const, names)
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
      return collectRecordImports(data, config, context, helper, names, refs)
    case 'object':
      return collectObjectTypeImports(data, config, context, helper, names, refs)
    case 'array':
      return collectArrayTypeImports(data, config, context, helper, names, refs)
    case 'tuple':
      return collectTupleImports(data, config, context, helper, names, refs)
    default:
      names.add(RuntimePackages.Validators.any)
      return
  }
}

export function getValidatorImports(
  fromPath: string,
  schema: Referenceable<SchemaObject>,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
  helper: TraversalHelper,
  collector: ImportCollector = collectImports,
): ImportDeclaration[] {
  const nameSet = new Set<string>()
  const refSet = new Set<string>()
  collector(schema, config, context, helper, nameSet, refSet)
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
      'oats/type-validator',
      refs.map((ref) => context.dereference<SchemaObject>(ref)),
      context,
    ),
  ]
}
