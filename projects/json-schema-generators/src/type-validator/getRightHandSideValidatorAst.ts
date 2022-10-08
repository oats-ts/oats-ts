import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { getInferredType, isReferenceObject } from '@oats-ts/model-common'
import { factory, Expression } from 'typescript'
import { RuntimePackages } from '@oats-ts/model-common'
import { getObjectValidatorAst } from './getObjectValidatorAst'
import { getRecordValidatorAst } from './getRecordValidatorAst'
import { getReferenceValidatorAst } from './getReferenceValidatorAst'
import { getUnionTypeValidatorAst } from './getUnionTypeValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'
import { getArrayValidatorAst } from './getArrayValidatorAst'
import { getEnumValidatorAst } from './getEnumValidatorAst'
import { getLiteralValidatorAst } from './getLiteralValidatorAst'
import { getTupleValidatorAst } from './getTupleValidatorAst'
import { getIntersectionTypeValidatorAst } from './getIntersectionTypeValidatorAst'
import { JsonSchemaGeneratorContext, TraversalHelper } from '../types'

export function getRightHandSideValidatorAst(
  data: SchemaObject | ReferenceObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
  helper: TraversalHelper,
): Expression {
  if (config.ignore(data, helper)) {
    return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.any), [], [])
  }
  if (isReferenceObject(data)) {
    return getReferenceValidatorAst(data, context, config, helper)
  }
  switch (getInferredType(data)) {
    case 'union':
      return getUnionTypeValidatorAst(data, context, config, helper)
    case 'intersection':
      return getIntersectionTypeValidatorAst(data, context, config, helper)
    case 'enum':
      return getEnumValidatorAst(data)
    case 'string':
      return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.string), [], [])
    case 'number':
      return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.number), [], [])
    case 'boolean':
      return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.boolean), [], [])
    case 'record':
      return getRecordValidatorAst(data, context, config, helper)
    case 'object':
      return getObjectValidatorAst(data, context, config, helper)
    case 'array':
      return getArrayValidatorAst(data, context, config, helper)
    case 'literal':
      return getLiteralValidatorAst(data)
    case 'tuple':
      return getTupleValidatorAst(data, context, config, helper)
    default:
      return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.any), [], [])
  }
}
