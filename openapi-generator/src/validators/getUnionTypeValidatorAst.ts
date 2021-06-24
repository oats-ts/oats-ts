import { isNil, values } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { factory, CallExpression, Identifier, PropertyAssignment } from 'typescript'
import { Validators } from '../common/OatsPackages'
import { getPrimitiveType, PrimitiveTypes } from '../common/primitiveTypeUtils'
import { OpenAPIGeneratorContext } from '../typings'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { ValidatorsGeneratorConfig } from './typings'

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
      factory.createIdentifier(accessor.name(accessor.dereference($ref), 'type')),
      getRightHandSideValidatorAst({ $ref }, context, config),
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
    return factory.createCallExpression(factory.createIdentifier(Validators.union), [], [parameters])
  }
  return factory.createIdentifier(Validators.any)
}
