import { isNil } from 'lodash'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { factory, SyntaxKind } from 'typescript'
import { getRighthandSideTypeAst } from './getRighthandSideTypeAst'
import { TypesGeneratorConfig } from './typings'
import { JsonSchemaGeneratorContext } from '../types'

export function getTypeReferenceAst(
  data: Referenceable<SchemaObject> | undefined,
  context: JsonSchemaGeneratorContext,
  config: TypesGeneratorConfig,
) {
  const { dereference, nameOf } = context
  const schema = isNil(data) ? null : dereference(data)
  if (isNil(schema)) {
    return factory.createKeywordTypeNode(SyntaxKind.AnyKeyword)
  }
  const name = nameOf(schema)
  if (isNil(name)) {
    return getRighthandSideTypeAst(schema, context, config)
  }
  return factory.createTypeReferenceNode(name)
}
