import { isNil, values } from 'lodash'
import { SchemaObject } from '@oats-ts/json-schema-model'
import { factory, CallExpression, Identifier, PropertyAssignment } from 'typescript'
import { getPrimitiveType, PrimitiveTypes, RuntimePackages } from '@oats-ts/model-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'
import { getReferenceValidatorAst } from './getReferenceValidatorAst'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'

function getUnionProperties(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
  level: number,
): PropertyAssignment[] {
  const { dereference, nameOf } = context
  if (isNil(data.discriminator)) {
    return data.oneOf.map((schemaOrRef) => {
      const schema = dereference(schemaOrRef)
      const rightHandSide =
        PrimitiveTypes.indexOf(schema.type) >= 0
          ? getRightHandSideValidatorAst(schema, context, config, level)
          : factory.createIdentifier('any')
      return factory.createPropertyAssignment(getPrimitiveType(schema), rightHandSide)
    })
  }
  const discriminators = values(data.discriminator.mapping || {})
  return discriminators.map(($ref) => {
    return factory.createPropertyAssignment(
      factory.createIdentifier(nameOf(dereference($ref), 'json-schema/type')),
      getReferenceValidatorAst({ $ref }, context, config, level),
    )
  })
}

export function getUnionTypeValidatorAst(
  data: SchemaObject,
  context: JsonSchemaGeneratorContext,
  config: ValidatorsGeneratorConfig,
  level: number,
): CallExpression | Identifier {
  if (!config.references && level > 0) {
    return factory.createIdentifier(RuntimePackages.Validators.any)
  }
  const properties = getUnionProperties(data, context, config, level)
  const parameters = factory.createObjectLiteralExpression(properties, properties.length > 1)
  return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.union), [], [parameters])
}
