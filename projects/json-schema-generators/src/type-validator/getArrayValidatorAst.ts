import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier } from 'typescript'
import { RuntimePackages } from '@oats-ts/model-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'
import { JsonSchemaGeneratorContext, TraversalHelper } from '../types'

export function getArrayValidatorAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
  helper: TraversalHelper,
): CallExpression | Identifier {
  const itemsSchema = data.items as Referenceable<SchemaObject>
  const itemsValidator = factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Validators.items),
    [],
    [getRightHandSideValidatorAst(itemsSchema, context, config, helper)],
  )
  return factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Validators.array),
    [],
    config.ignore(itemsSchema, helper) ? [] : [itemsValidator],
  )
}
