import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier, Expression } from 'typescript'
import { RuntimePackages } from '@oats-ts/model-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig, ValidatorsGeneratorContext } from './typings'

export function getArrayValidatorAst(
  data: SchemaObject,
  context: ValidatorsGeneratorContext,
  config: ValidatorsGeneratorConfig,
  level: number,
): CallExpression | Identifier {
  const args: Expression[] = []
  if (config.arrays) {
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
