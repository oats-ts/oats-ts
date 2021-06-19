import { SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../typings'
import { ImportDeclaration } from '@babel/types'
import { entries, isNil, keys, sortBy, values } from 'lodash'
import { Validators } from '../common/OatsPackages'
import { importAst } from '../common/babelUtils'

function collectImportedNames(data: SchemaObject, names: Set<string>): void {
  if (!isNil(data.oneOf)) {
    // names.add(Validators.union)
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
    return collectImportedNames(data.additionalProperties, names)
  }

  if (!isNil(data.properties)) {
    names.add(Validators.object).add(Validators.shape)
    for (const [name, propSchema] of entries(data.properties)) {
      const isOptional = (data.required || []).indexOf(name) < 0
      if (isOptional) {
        names.add(Validators.optional)
      }
      collectImportedNames(propSchema, names)
    }
    return collectImportedNames(data.properties, names)
  }

  if (!isNil(data.items)) {
    names.add(Validators.array)
    return collectImportedNames(data.items, names)
  }

  names.add(Validators.any)
}

export function getValidatorImports(schema: SchemaObject, context: OpenAPIGeneratorContext): ImportDeclaration {
  const nameSet = new Set<string>()
  collectImportedNames(schema, nameSet)
  return importAst(
    Validators.name,
    sortBy(Array.from(nameSet), (name) => name),
  )
}
