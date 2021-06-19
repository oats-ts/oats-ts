import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { ImportDeclaration } from '@babel/types'
import { entries, isNil, keys, sortBy, values } from 'lodash'
import { Validators } from '../common/OatsPackages'
import { importAst } from '../common/babelUtils'
import { getImportDeclarations } from '../common/getImportDeclarations'

function collectImportedNames(
  data: SchemaObject | ReferenceObject,
  names: Set<string>,
  refs: Set<ReferenceObject>,
  references: boolean,
): void {
  if (isReferenceObject(data)) {
    if (!references) {
      names.add(Validators.any)
    } else {
      names.add(Validators.lazy)
      refs.add(data)
    }
    return
  }

  // TODO
  if (!isNil(data.oneOf)) {
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
    names.add(Validators.object).add(Validators.record)
    return collectImportedNames(data.additionalProperties, names, refs, references)
  }

  if (!isNil(data.properties)) {
    names.add(Validators.object).add(Validators.shape)
    for (const [name, propSchema] of entries(data.properties)) {
      const isOptional = (data.required || []).indexOf(name) < 0
      if (isOptional) {
        names.add(Validators.optional)
      }
      collectImportedNames(propSchema, names, refs, references)
    }
    return collectImportedNames(data.properties, names, refs, references)
  }

  if (!isNil(data.items)) {
    names.add(Validators.array)
    return collectImportedNames(data.items, names, refs, references)
  }

  names.add(Validators.any)
}

export function getValidatorImports(
  schema: SchemaObject,
  context: OpenAPIGeneratorContext,
  references: boolean,
): ImportDeclaration[] {
  const { accessor } = context
  const nameSet = new Set<string>()
  const refs = new Set<ReferenceObject>()
  collectImportedNames(schema, nameSet, refs, references)
  const asts = [
    importAst(
      Validators.name,
      sortBy(Array.from(nameSet), (name) => name),
    ),
    ...getImportDeclarations(
      accessor.path(schema, 'validator'),
      'validator',
      Array.from(refs).map((ref) => accessor.dereference<SchemaObject>(ref)),
      context,
    ),
  ]
  return asts
}
