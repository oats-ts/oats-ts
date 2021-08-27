import { ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier } from 'typescript'
import { RuntimePackages } from '@oats-ts/model-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig, ValidatorsGeneratorContext } from './typings'

export function getRecordValidatorAst(
  data: SchemaObject,
  context: ValidatorsGeneratorContext,
  config: ValidatorsGeneratorConfig,
  level: number,
): CallExpression | Identifier {
  return factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Validators.object),
    [],
    config.records
      ? [
          factory.createCallExpression(
            factory.createIdentifier(RuntimePackages.Validators.record),
            [],
            [
              factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.string), [], []),
              getRightHandSideValidatorAst(
                data.additionalProperties as SchemaObject | ReferenceObject,
                context,
                config,
                level + 1,
              ),
            ],
          ),
        ]
      : [],
  )
}
