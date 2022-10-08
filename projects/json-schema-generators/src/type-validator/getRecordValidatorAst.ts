import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier } from 'typescript'
import { RuntimePackages } from '@oats-ts/model-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'
import { JsonSchemaGeneratorContext, TraversalHelper } from '../types'

export function getRecordValidatorAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
  helper: TraversalHelper,
): CallExpression | Identifier {
  const addPropsSchema = data.additionalProperties as Referenceable<SchemaObject>
  const params = factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Validators.record),
    [],
    [
      factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.string), [], []),
      getRightHandSideValidatorAst(
        data.additionalProperties as SchemaObject | ReferenceObject,
        context,
        config,
        helper,
      ),
    ],
  )
  return factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Validators.object),
    [],
    config.ignore(addPropsSchema, helper) ? [] : [params],
  )
}
