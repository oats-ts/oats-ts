import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier } from 'typescript'
import { RuntimePackages } from '@oats-ts/model-common'
import { ValidatorsGeneratorConfig } from './typings'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { JsonSchemaGeneratorContext, TraversalHelper } from '../types'

export function getTupleValidatorAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
  helper: TraversalHelper,
): CallExpression | Identifier {
  const { prefixItems = [], minItems = 0 } = data
  const parameters = prefixItems.map((item, index) => {
    const validator = getRightHandSideValidatorAst(item, context, config, helper)
    return index < minItems
      ? validator
      : factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.optional), [], [validator])
  })
  return factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Validators.array),
    [],
    [factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.tuple), [], parameters)],
  )
}
