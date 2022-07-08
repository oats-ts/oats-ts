import { SchemaObject, Referenceable } from '@oats-ts/json-schema-model'
import { factory, SyntaxKind, TypeNode } from 'typescript'
import { getArrayTypeAst } from './getArrayTypeAst'
import { getDictionaryTypeAst } from './getDictionaryTypeAst'
import { getLiteralUnionTypeAst } from './getLiteralUnionTypeAst'
import { getObjectTypeAst } from './getObjectTypeAst'
import { getUnionTypeAst } from './getUnionTypeAst'
import { TypesGeneratorConfig } from './typings'
import { getIntersectionTypeAst } from './getIntersectionTypeAst'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { getTupleTypeAst } from './getTupleTypeAst'
import { getConstantTypeAst } from './getConstantTypeAst'
import { getInferredType } from '@oats-ts/model-common'
import { JsonSchemaGeneratorContext } from '../types'

export function getRighthandSideTypeAst(
  data: Referenceable<SchemaObject>,
  context: JsonSchemaGeneratorContext,
  config: TypesGeneratorConfig,
): TypeNode {
  switch (getInferredType(data)) {
    case 'ref':
      return getTypeReferenceAst(data, context, config)
    case 'array':
      return getArrayTypeAst(data as SchemaObject, context, config)
    case 'enum':
      return getLiteralUnionTypeAst(data as SchemaObject, context)
    case 'object':
      return getObjectTypeAst(data as SchemaObject, context, config)
    case 'record':
      return getDictionaryTypeAst(data as SchemaObject, context, config)
    case 'union':
      return getUnionTypeAst(data as SchemaObject, context, config)
    case 'intersection':
      return getIntersectionTypeAst(data as SchemaObject, context, config)
    case 'literal':
      return getConstantTypeAst(data as SchemaObject, context)
    case 'tuple':
      return getTupleTypeAst(data as SchemaObject, context, config)
    case 'string':
      return factory.createKeywordTypeNode(SyntaxKind.StringKeyword)
    case 'boolean':
      return factory.createKeywordTypeNode(SyntaxKind.BooleanKeyword)
    case 'number':
      return factory.createKeywordTypeNode(SyntaxKind.NumberKeyword)
    default:
      return factory.createKeywordTypeNode(SyntaxKind.AnyKeyword)
  }
}
