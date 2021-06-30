import { SchemaObject } from 'openapi3-ts'
import { factory, CallExpression, Identifier, Expression } from 'typescript'
import { RuntimePackages, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'

export function getArrayValidatorAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
): CallExpression | Identifier {
  const args: Expression[] = []
  if (config.arrays) {
    args.push(
      factory.createCallExpression(
        factory.createIdentifier(RuntimePackages.Validators.items),
        [],
        [getRightHandSideValidatorAst(data.items, context, config)],
      ),
    )
  }
  return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.array), [], args)
}
