import { BaseParameterObject, ParameterLocation, ParameterObject } from '@oats-ts/openapi-model'
import { getParameterName, OpenAPIGeneratorContext, RuntimePackages } from '@oats-ts/openapi-common'
import { has, isNil, negate } from 'lodash'
import { getParameterSerializerFactoryName } from './getParameterSerializerFactoryName'
import { getParameterStyle, getParameterKind } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { CallExpression, factory, ObjectLiteralExpression, PropertyAssignment, TypeReferenceType } from 'typescript'
import { isIdentifier } from '@oats-ts/typescript-common'
import { Referenceable } from '@oats-ts/json-schema-model'

function getSerializerOptionProperty(
  key: keyof BaseParameterObject,
  parameter: BaseParameterObject,
): PropertyAssignment {
  return has(parameter, key)
    ? factory.createPropertyAssignment(
        factory.createIdentifier(key.toString()),
        Boolean(parameter[key]) ? factory.createTrue() : factory.createFalse(),
      )
    : undefined
}

function getSerializerOptionProperties(parameter: BaseParameterObject): PropertyAssignment[] {
  const { in: location = 'header' } = parameter as ParameterObject
  switch (location) {
    case 'query':
      return [
        getSerializerOptionProperty('allowReserved', parameter),
        getSerializerOptionProperty('explode', parameter),
        getSerializerOptionProperty('required', parameter),
      ]
    case 'header':
      return [getSerializerOptionProperty('explode', parameter), getSerializerOptionProperty('required', parameter)]
    case 'path':
      return [getSerializerOptionProperty('explode', parameter)]
  }
  return []
}

function getSerializerOptions(parameter: BaseParameterObject): ObjectLiteralExpression {
  return factory.createObjectLiteralExpression(getSerializerOptionProperties(parameter).filter(negate(isNil)))
}

function createParameterSerializer(parameter: BaseParameterObject, context: OpenAPIGeneratorContext): CallExpression {
  const { dereference, referenceOf } = context
  const { in: location = 'header' } = parameter as ParameterObject
  const { schema } = parameter
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createPropertyAccessExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(RuntimePackages.ParameterSerialization.serializers),
          factory.createIdentifier(location),
        ),
        factory.createIdentifier(getParameterStyle(parameter)),
      ),
      factory.createIdentifier(getParameterKind(dereference(schema))),
    ),
    [referenceOf(schema, 'json-schema/type')],
    [getSerializerOptions(parameter)],
  )
}

function createSerializerProperty(
  parameter: Referenceable<BaseParameterObject>,
  context: OpenAPIGeneratorContext,
): PropertyAssignment {
  const { dereference } = context
  const name = getParameterName(parameter, context)
  return factory.createPropertyAssignment(
    isIdentifier(name) ? name : factory.createStringLiteral(name),
    createParameterSerializer(dereference(parameter, true), context),
  )
}

function createSerializersObject(
  parameters: Referenceable<BaseParameterObject>[],
  context: OpenAPIGeneratorContext,
): ObjectLiteralExpression {
  return factory.createObjectLiteralExpression(
    parameters.map((parameter) => createSerializerProperty(parameter, context)),
  )
}

export function getParameterSerializerFactoryCall(
  location: ParameterLocation,
  data: EnhancedOperation,
  parameters: Referenceable<BaseParameterObject>[],
  genericType: TypeReferenceType,
  context: OpenAPIGeneratorContext,
): CallExpression {
  return factory.createCallExpression(
    factory.createIdentifier(getParameterSerializerFactoryName(location)),
    [genericType],
    [
      ...(location === 'path' ? [factory.createStringLiteral(data.url)] : []),
      createSerializersObject(parameters, context),
    ],
  )
}
