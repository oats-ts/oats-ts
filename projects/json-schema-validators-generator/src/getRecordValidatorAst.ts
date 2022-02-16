import { Referenceable, ReferenceObject, SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier, Expression } from 'typescript'
import { RuntimePackages } from '@oats-ts/model-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

export function getRecordValidatorAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
  level: number,
): CallExpression | Identifier {
  const { uriOf } = context
  const addPropsSchema = data.additionalProperties as Referenceable<SchemaObject>
  const uri = uriOf(addPropsSchema)
  const params = factory.createCallExpression(
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
  )
  return factory.createCallExpression(
    factory.createIdentifier(RuntimePackages.Validators.object),
    [],
    config.ignore(addPropsSchema, uri) ? [] : [params],
  )
}
