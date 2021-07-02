import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { isEmpty, entries, isNil, sortBy, values } from 'lodash'
import { RuntimePackages, OpenAPIGeneratorContext, getDiscriminators } from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'
import { ValidatorsGeneratorConfig } from './typings'
import { getModelImports, getNamedImports } from '@oats-ts/typescript-common'

export type ImportCollector = (
  data: SchemaObject | ReferenceObject,
  config: ValidatorsGeneratorConfig,
  context: OpenAPIGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
) => void

export function collectExternalReferenceImports(
  data: SchemaObject | ReferenceObject,
  config: ValidatorsGeneratorConfig,
  context: OpenAPIGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
): void {
  const { accessor } = context
  const schema = accessor.dereference(data)
  if (!isNil(accessor.name(schema, 'validator'))) {
    refs.add(accessor.uri(schema))
  } else {
    collectImports(schema, config, context, names, refs)
  }
}

export function collectReferenceImports(
  data: SchemaObject | ReferenceObject,
  config: ValidatorsGeneratorConfig,
  context: OpenAPIGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
): void {
  if (!config.references) {
    names.add(RuntimePackages.Validators.any)
  } else {
    const schema = context.accessor.dereference(data)
    if (!isNil(context.accessor.name(schema, 'validator'))) {
      names.add(RuntimePackages.Validators.lazy)
      refs.add(data.$ref)
    } else {
      collectImports(schema, config, context, names, refs)
    }
  }
}

export function collectUnionImports(
  data: SchemaObject,
  config: ValidatorsGeneratorConfig,
  context: OpenAPIGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
): void {
  names.add(RuntimePackages.Validators.union)
  if (!isNil(data.discriminator) && (config.references || config.unionReferences)) {
    // TODO maybe better of collecting discriminators
    const discRefs = values(data.discriminator.mapping || {})
    values(data.discriminator.mapping || {}).map((ref) => refs.add(ref))
    if (discRefs.length > 0) {
      names.add(RuntimePackages.Validators.lazy)
    }
  } else {
    for (const schemaOrRef of data.oneOf) {
      collectImports(schemaOrRef, config, context, names, refs)
    }
  }
}

export function collectRecordImports(
  data: SchemaObject,
  config: ValidatorsGeneratorConfig,
  context: OpenAPIGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
): void {
  names.add(RuntimePackages.Validators.object)
  if (config.records) {
    names.add(RuntimePackages.Validators.record)
    collectImports(data.additionalProperties as SchemaObject | ReferenceObject, config, context, names, refs)
  }
}

export function collectObjectTypeImports(
  data: SchemaObject,
  config: ValidatorsGeneratorConfig,
  context: OpenAPIGeneratorContext,
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
    collectImports(propSchema, config, context, names, refs)
  }
}

export function collectArrayTypeImports(
  data: SchemaObject,
  config: ValidatorsGeneratorConfig,
  context: OpenAPIGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
): void {
  names.add(RuntimePackages.Validators.array)
  if (config.arrays) {
    names.add(RuntimePackages.Validators.items)
    return collectImports(data.items, config, context, names, refs)
  }
}

export function collectImports(
  data: SchemaObject | ReferenceObject,
  config: ValidatorsGeneratorConfig,
  context: OpenAPIGeneratorContext,
  names: Set<string>,
  refs: Set<string>,
): void {
  if (isReferenceObject(data)) {
    return collectReferenceImports(data, config, context, names, refs)
  }

  if (!isNil(data.oneOf)) {
    return collectUnionImports(data, config, context, names, refs)
  }

  if (!isNil(data.enum)) {
    names.add(RuntimePackages.Validators.enumeration)
    return
  }

  if (data.type === 'string') {
    names.add(RuntimePackages.Validators.string)
    return
  }

  if (data.type === 'number' || data.type === 'integer') {
    names.add(RuntimePackages.Validators.number)
    return
  }

  if (data.type === 'boolean') {
    names.add(RuntimePackages.Validators.boolean)
    return
  }

  if (!isNil(data.additionalProperties) && typeof data.additionalProperties !== 'boolean') {
    return collectRecordImports(data, config, context, names, refs)
  }

  if (!isNil(data.properties)) {
    return collectObjectTypeImports(data, config, context, names, refs)
  }

  if (!isNil(data.items)) {
    return collectArrayTypeImports(data, config, context, names, refs)
  }

  names.add(RuntimePackages.Validators.any)
}

export function getValidatorImports(
  fromPath: string,
  schema: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
  collector: ImportCollector = collectImports,
): ImportDeclaration[] {
  const { accessor } = context
  const nameSet = new Set<string>()
  const refSet = new Set<string>()
  collector(schema, config, context, nameSet, refSet)
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
    ...getModelImports(
      fromPath,
      'validator',
      refs.map((ref) => accessor.dereference<SchemaObject>(ref)),
      context,
    ),
  ]
}
