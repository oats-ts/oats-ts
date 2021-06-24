import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { entries, isNil, sortBy, values } from 'lodash'
import { Validators } from '../common/OatsPackages'
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
      names.add(Validators.any)
    } else {
      names.add(Validators.lazy)
      refs.add(data.$ref)
    }
    return
  }

  if (!isNil(data.oneOf)) {
    names.add(Validators.union)
    if (!isNil(data.discriminator) && (config.references || config.unionReferences)) {
      // TODO maybe better of collecting discriminators
      names.add(Validators.literal)
      values(data.discriminator.mapping || {}).map((ref) => refs.add(ref))
    }
    return
  }

  if (!isNil(data.enum)) {
    names.add(Validators.enumeration)
    return
  }

  if (data.type === 'string') {
    names.add(Validators.string)
    return
  }

  if (data.type === 'number' || data.type === 'integer') {
    names.add(Validators.number)
    return
  }

  if (data.type === 'boolean') {
    names.add(Validators.boolean)
    return
  }

  if (!isNil(data.additionalProperties) && typeof data.additionalProperties !== 'boolean') {
    names.add(Validators.object)
    if (config.records) {
      names.add(Validators.record)
      return collectImportedNames(data.additionalProperties, names, refs, config)
    }
    return
  }

  if (!isNil(data.properties)) {
    names.add(Validators.object).add(Validators.shape)
    for (const [name, propSchema] of entries(data.properties)) {
      const isOptional = (data.required || []).indexOf(name) < 0
      if (isOptional) {
        names.add(Validators.optional)
      }
      collectImportedNames(propSchema, names, refs, config)
    }
    return
  }

  if (!isNil(data.items)) {
    names.add(Validators.array)
    if (config.arrays) {
      names.add(Validators.items)
      return collectImportedNames(data.items, names, refs, config)
    }
    return
  }

  names.add(Validators.any)
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
      Validators.name,
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
