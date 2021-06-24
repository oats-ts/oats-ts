import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { factory, CallExpression, Identifier } from 'typescript'
import { Validators } from '../common/OatsPackages'
import { OpenAPIGeneratorContext } from '../typings'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'

export function getRecordValidatorAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
): CallExpression | Identifier {
  return factory.createCallExpression(
    factory.createIdentifier(Validators.object),
    [],
    config.records
      ? [
          factory.createCallExpression(
            factory.createIdentifier(Validators.record),
            [],
            [
              factory.createCallExpression(factory.createIdentifier(Validators.string), [], []),
              getRightHandSideValidatorAst(
                data.additionalProperties as SchemaObject | ReferenceObject,
                context,
                config,
              ),
            ],
          ),
        ]
      : [],
  )
}
