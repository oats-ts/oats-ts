import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { factory, CallExpression, Identifier } from 'typescript'
import { RuntimePackages, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'

export function getRecordValidatorAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
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
