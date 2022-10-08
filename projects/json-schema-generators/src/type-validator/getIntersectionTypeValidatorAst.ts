import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier } from 'typescript'
import { RuntimePackages } from '@oats-ts/model-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'
import { JsonSchemaGeneratorContext, TraversalHelper } from '../types'

export function getIntersectionTypeValidatorAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
  helper: TraversalHelper,
): CallExpression | Identifier {
  const parameters = (data.allOf || []).map((item) => getRightHandSideValidatorAst(item, context, config, helper))
  return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.combine), [], parameters)
}
