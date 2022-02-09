import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier, Expression } from 'typescript'
import { RuntimePackages } from '@oats-ts/model-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function getArrayValidatorAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
  level: number,
): CallExpression | Identifier {
  const args: Expression[] = []
  if (config.arrays && typeof data.items !== 'boolean') {
    args.push(
      factory.createCallExpression(
        factory.createIdentifier(RuntimePackages.Validators.items),
        [],
        [getRightHandSideValidatorAst(data.items, context, config, level + 1)],
      ),
    )
  }
  return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.array), [], args)
}
