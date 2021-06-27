import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { entries, isNil, sortBy, values } from 'lodash'
import { RuntimePackages, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { ImportDeclaration } from 'typescript'
import { tsImportAst, tsModelImportAsts } from '../common/typeScriptUtils'
import { ValidatorsGeneratorConfig } from './typings'

function collectImportedNames(
  data: SchemaObject | ReferenceObject,
  names: Set<string>,
  refs: Set<string>,
  config: ValidatorsGeneratorConfig,
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
      names.add(RuntimePackages.Validators.literal)
      values(data.discriminator.mapping || {}).map((ref) => refs.add(ref))
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
      return collectImportedNames(data.additionalProperties, names, refs, config)
    }
    return
  }

  if (!isNil(data.properties)) {
    names.add(RuntimePackages.Validators.object).add(RuntimePackages.Validators.shape)
    for (const [name, propSchema] of entries(data.properties)) {
      const isOptional = (data.required || []).indexOf(name) < 0
      if (isOptional) {
        names.add(RuntimePackages.Validators.optional)
      }
      collectImportedNames(propSchema, names, refs, config)
    }
    return
  }

  if (!isNil(data.items)) {
    names.add(RuntimePackages.Validators.array)
    if (config.arrays) {
      names.add(RuntimePackages.Validators.items)
      return collectImportedNames(data.items, names, refs, config)
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
  collectImportedNames(schema, nameSet, refs, config)
  const asts = [
    tsImportAst(
      RuntimePackages.Validators.name,
      sortBy(Array.from(nameSet), (name) => name),
    ),
    ...tsModelImportAsts(
      accessor.path(schema, 'validator'),
      'validator',
      Array.from(refs).map((ref) => accessor.dereference<SchemaObject>(ref)),
      context,
    ),
  ]
  return asts
}
