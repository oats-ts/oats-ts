import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, TypeNode } from 'typescript'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { TypesGeneratorConfig } from './typings'

export function getTupleTypeAst(
  schema: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: TypesGeneratorConfig,
): TypeNode {
  const { prefixItems = [], minItems = 0 } = schema
  const types = prefixItems.map((tupleItem, index) => {
    const type = getTypeReferenceAst(tupleItem, context, config)
    return index < minItems ? type : factory.createOptionalTypeNode(type)
  })
  return factory.createTupleTypeNode(types)
}
