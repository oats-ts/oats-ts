import { isNil, values } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { factory, CallExpression, Identifier, PropertyAssignment } from 'typescript'
import { RuntimePackages, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'
import { getPrimitiveType, PrimitiveTypes } from '@oats-ts/typescript-common'
import { getReferenceValidatorAst } from './getReferenceValidatorAst'

function getUnionProperties(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
): PropertyAssignment[] {
  const { accessor } = context
  if (isNil(data.discriminator)) {
    return data.oneOf.map((schemaOrRef) => {
      const schema = accessor.dereference(schemaOrRef)
      const rightHandSide =
        PrimitiveTypes.indexOf(schema.type) >= 0
          ? getRightHandSideValidatorAst(schema, context, config)
          : factory.createIdentifier('any')
      return factory.createPropertyAssignment(getPrimitiveType(schema), rightHandSide)
    })
  }
  const discriminators = values(data.discriminator.mapping || {})
  return discriminators.map(($ref) => {
    return factory.createPropertyAssignment(
      factory.createIdentifier(accessor.name(accessor.dereference($ref), 'openapi/type')),
      getReferenceValidatorAst({ $ref }, context, config, true, config.references || config.unionReferences),
    )
  })
}

export function getUnionTypeValidatorAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  config: ValidatorsGeneratorConfig,
): CallExpression | Identifier {
  if (config.unionReferences || config.references) {
    const properties = getUnionProperties(data, context, config)
    const parameters = factory.createObjectLiteralExpression(properties, properties.length > 1)
    return factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.union), [], [parameters])
  }
  return factory.createIdentifier(RuntimePackages.Validators.any)
}
