import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier, Expression } from 'typescript'
import { RuntimePackages, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'

export function getArrayValidatorAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
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
