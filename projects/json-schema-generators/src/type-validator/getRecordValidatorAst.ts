import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier } from 'typescript'
import { RuntimePackages } from '@oats-ts/model-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'
import { JsonSchemaGeneratorContext } from '../types'

export function getRecordValidatorAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
): CallExpression | Identifier {
  const { uriOf } = context
  const addPropsSchema = data.additionalProperties as Referenceable<SchemaObject>
  const uri = uriOf(addPropsSchema)
  const params = factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Validators.record),
    [],
    [
      factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.string), [], []),
      getRightHandSideValidatorAst(data.additionalProperties as SchemaObject | ReferenceObject, context, config),
    ],
  )
  return factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Validators.object),
    [],
    config.ignore(addPropsSchema, uri) ? [] : [params],
  )
}
