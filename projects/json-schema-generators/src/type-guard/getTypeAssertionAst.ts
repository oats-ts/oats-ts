import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { getInferredType, JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { Expression, factory } from 'typescript'
import { getArrayTypeAssertionAst } from './getArrayTypeAssertionAst'
import { getEnumAssertionAst } from './getEnumAssertionAst'
import { getObjectTypeAssertionAst } from './getObjectTypeAssertionAst'
import { getPrimitiveTypeAssertionAst } from './getPrimitiveTypeAssertionAst'
import { getRecordTypeAssertionAst } from './getRecordTypeAssertionAst'
import { getReferenceAssertionAst } from './getReferenceAssertionAst'
import { getUnionTypeAssertionAst } from './getUnionTypeAssertionAst'
import { TypeGuardGeneratorConfig } from './typings'
import { isReferenceObject } from '@oats-ts/model-common'
import { getLiteralTypeAssertionAst } from './getLiteralTypeAssertionAst'
import { getTupleTypeAssertionAst } from './getTupleTypeAssertionAst'
import { getIntersectionTypeAssertionAst } from './getIntersectionTypeAssertionAst'
import { isNil } from 'lodash'

export function getTypeAssertionAst(
  data: Referenceable<SchemaObject> | undefined,
  context: JsonSchemaGeneratorContext,
  variable: Expression,
  config: TypeGuardGeneratorConfig,
  level: number,
): Expression {
  const { uriOf } = context
  if (isNil(data) || config.ignore(data, uriOf(data))) {
    // If a top level schema is ignored, he type guard will always return false.
    // Otherwise the generated expression is true, meaning it's ignored.
    return level === 0 ? factory.createFalse() : factory.createTrue()
  }

  if (isReferenceObject(data)) {
    return getReferenceAssertionAst(data, context, variable, config, level)
  }

  switch (getInferredType(data)) {
    case 'union':
      return getUnionTypeAssertionAst(data, context, variable, config, level)
    case 'enum':
      return getEnumAssertionAst(data, context, variable, config)
    case 'literal':
      return getLiteralTypeAssertionAst(data, context, variable, config)
    case 'intersection':
      return getIntersectionTypeAssertionAst(data, context, variable, config, level)
    case 'string':
    case 'number':
    case 'boolean':
      return getPrimitiveTypeAssertionAst(data, context, variable, config)
    case 'record':
      return getRecordTypeAssertionAst(data, context, variable, config, level)
    case 'object':
      return getObjectTypeAssertionAst(data, context, variable, config, level)
    case 'array':
      return getArrayTypeAssertionAst(data, context, variable, config, level)
    case 'tuple':
      return getTupleTypeAssertionAst(data, context, variable, config, level)
    default:
      return factory.createTrue()
  }
}
