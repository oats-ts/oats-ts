import { isNil, values } from 'lodash'
import { SchemaObject } from 'openapi3-ts'
import { factory, CallExpression, Identifier, PropertyAssignment } from 'typescript'
import { Validators } from '../common/OatsPackages'
import { getPrimitiveType, PrimitiveTypes } from '../common/primitiveTypeUtils'
import { OpenAPIGeneratorContext } from '../typings'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'

function getUnionProperties(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  references: boolean,
): PropertyAssignment[] {
  const { accessor } = context
  if (isNil(data.discriminator)) {
    return data.oneOf.map((schemaOrRef) => {
      const schema = accessor.dereference(schemaOrRef)
      const rightHandSide =
        PrimitiveTypes.indexOf(schema.type) >= 0
          ? getRightHandSideValidatorAst(schema, context, false)
          : factory.createIdentifier('any')
      return factory.createPropertyAssignment(getPrimitiveType(schema), rightHandSide)
    })
  }
  const discriminators = values(data.discriminator.mapping || {})
  return discriminators.map(($ref) => {
    return factory.createPropertyAssignment(
      factory.createIdentifier(accessor.name(accessor.dereference($ref), 'type')),
      getRightHandSideValidatorAst({ $ref }, context, references),
    )
  })
}

export function getUnionTypeValidatorAst(
  data: SchemaObject,
  context: OpenAPIGeneratorContext,
  references: boolean,
): CallExpression | Identifier {
  const properties = getUnionProperties(data, context, references)
  const parameters = factory.createObjectLiteralExpression(properties, properties.length > 1)
  return factory.createCallExpression(factory.createIdentifier(Validators.union), [], [parameters])
}
