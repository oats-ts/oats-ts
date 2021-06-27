import { isNil } from 'lodash'
import { isReferenceObject, ReferenceObject, SchemaObject } from 'openapi3-ts'
import { Expression, factory } from 'typescript'
import { PrimitiveTypes } from '../common/primitiveTypeUtils'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getArrayTypeAssertionAst } from './getArrayTypeAssertion'
import { getEnumAssertionAst } from './getEnumAssertionAst'
import { getObjectTypeAssertionAst } from './getObjectTypeAssertionAst'
import { getPrimitiveTypeAssertionAst } from './getPrimitiveTypeAssertionAst'
import { getRecordTypeAssertionAst } from './getRecordTypeAssertionAst'
import { getReferenceAssertionAst } from './getReferenceAssertionAst'
import { getUnionTypeAssertionAst } from './getUnionTypeAssertionAst'
import { FullTypeGuardGeneratorConfig } from './typings'

export function getTypeAssertionAst(
  data: SchemaObject | ReferenceObject,
  context: OpenAPIGeneratorContext,
  variable: Expression,
  config: FullTypeGuardGeneratorConfig,
): Expression {
  if (isReferenceObject(data)) {
    return getReferenceAssertionAst(data, context, variable, config)
  }

  if (!isNil(data.oneOf)) {
    return getUnionTypeAssertionAst(data, context, variable, config)
  }

  if (!isNil(data.enum) && data.enum.length > 0) {
    return getEnumAssertionAst(data, context, variable, config)
  }

  if (PrimitiveTypes.includes(data.type)) {
    return getPrimitiveTypeAssertionAst(data, context, variable, config)
  }

  if (!isNil(data.additionalProperties) && typeof data.additionalProperties !== 'boolean') {
    return getRecordTypeAssertionAst(data, context, variable, config)
  }

  if (!isNil(data.properties)) {
    return getObjectTypeAssertionAst(data, context, variable, config)
  }

  if (!isNil(data.items)) {
    return getArrayTypeAssertionAst(data, context, variable, config)
  }

  return factory.createTrue()
}
