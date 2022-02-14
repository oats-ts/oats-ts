import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from '@oats-ts/model-common'
import { factory, CallExpression, Identifier, Expression } from 'typescript'
import { RuntimePackages } from '@oats-ts/model-common'
import { getInferredType, JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { getObjectValidatorAst } from './getObjectValidatorAst'
import { getRecordValidatorAst } from './getRecordValidatorAst'
import { getReferenceValidatorAst } from './getReferenceValidatorAst'
import { getUnionTypeValidatorAst } from './getUnionTypeValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'
import { getLiteralAst } from '@oats-ts/typescript-common'
import { getArrayValidatorAst } from './getArrayValidatorAst'
import { getEnumValidatorAst } from './getEnumValidatorAst'
import { getLiteralValidatorAst } from './getLiteralValidatorAst'
import { getTupleValidatorAst } from './getTupleValidatorAst'

export function getRightHandSideValidatorAst(
  data: SchemaObject | ReferenceObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
  level: number,
): Expression {
  if (isReferenceObject(data)) {
    return getReferenceValidatorAst(data, context, config, level)
  }
  switch (getInferredType(data)) {
    case 'union':
      return getUnionTypeValidatorAst(data, context, config, level)
    case 'enum':
      return getEnumValidatorAst(data)
    case 'string':
      return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.string), [], [])
    case 'number':
      return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.number), [], [])
    case 'boolean':
      return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.boolean), [], [])
    case 'record':
      return getRecordValidatorAst(data, context, config, level)
    case 'object':
      return getObjectValidatorAst(data, context, config, level)
    case 'array':
      return getArrayValidatorAst(data, context, config, level)
    case 'literal':
      return getLiteralValidatorAst(data)
    case 'tuple':
      return getTupleValidatorAst(data, context, config, level)
    default:
      return factory.createIdentifier(RuntimePackages.Validators.any)
  }
}
