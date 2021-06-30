import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { entries, isNil, sortBy, values, flatMap } from 'lodash'
import { RuntimePackages, OpenAPIGeneratorContext, getDiscriminators } from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'
import { ValidatorsGeneratorConfig } from './typings'
import { getModelImports, getNamedImports } from '@oats-ts/typescript-common'

function collectImportedNames(
  data: SchemaObject | ReferenceObject,
  names: Set<string>,
  refs: Set<string>,
  config: ValidatorsGeneratorConfig,
  context: OpenAPIGeneratorContext,
): void {
  if (isReferenceObject(data)) {
    if (!config.references) {
      names.add(RuntimePackages.Validators.any)
    } else {
      names.add(RuntimePackages.Validators.lazy)
      refs.add(data.$ref)
    }
    return
  }

  if (!isNil(data.oneOf)) {
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
        collectImportedNames(schemaOrRef, names, refs, config, context)
      }
    }
    return
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
    names.add(RuntimePackages.Validators.object)
    if (config.records) {
      names.add(RuntimePackages.Validators.record)
      return collectImportedNames(data.additionalProperties, names, refs, config, context)
    }
    return
  }

  if (!isNil(data.properties)) {
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
      collectImportedNames(propSchema, names, refs, config, context)
    }
    return
  }

  if (!isNil(data.items)) {
    names.add(RuntimePackages.Validators.array)
    if (config.arrays) {
      names.add(RuntimePackages.Validators.items)
      return collectImportedNames(data.items, names, refs, config, context)
    }
    return
  }

  names.add(RuntimePackages.Validators.any)
}

export function getValidatorImports(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
): ImportDeclaration[] {
  const { accessor } = context
  const nameSet = new Set<string>()
  const refs = new Set<string>()
  collectImportedNames(schema, nameSet, refs, config, context)
  const schemaRefs = Array.from(refs).map((ref) => accessor.dereference<SchemaObject>(ref))
  const path = accessor.path(schema, 'validator')
  const asts = [
    getNamedImports(
      RuntimePackages.Validators.name,
      sortBy(Array.from(nameSet), (name) => name),
    ),
    ...flatMap(schemaRefs, (s) => accessor.dependencies(path, s, 'validator')),
  ]
  return asts
}
