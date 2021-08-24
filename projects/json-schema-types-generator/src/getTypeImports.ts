import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'
import { getReferencedNamedSchemas } from '@oats-ts/model-common'
import { isNil } from 'lodash'
import { TypesGeneratorContext } from './typings'

export function getTypeImports(
  fromPath: string,
  schema: Referenceable<SchemaObject>,
  context: TypesGeneratorContext,
  referenceOnly: boolean,
): ImportDeclaration[] {
  const { nameOf, target } = context
  const name = nameOf(schema)
  if (referenceOnly && !isNil(name)) {
    return getModelImports(fromPath, target, [schema], context)
  }
  return getModelImports(fromPath, target, getReferencedNamedSchemas(schema, context), context)
}
