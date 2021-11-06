import { BaseParameterObject, ParameterLocation, ParameterObject } from '@oats-ts/openapi-model'
import {
  getParameterKind,
  getParameterName,
  getParameterStyle,
  OpenAPIGeneratorContext,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { has, isNil, negate } from 'lodash'
import { getParameterDeserializerFactoryName } from './getParameterDeserializerFactoryName'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import { CallExpression, factory, ObjectLiteralExpression, PropertyAssignment, TypeReferenceType } from 'typescript'
import { isIdentifier } from '@oats-ts/typescript-common'
import { getDeserializerAst } from './getDeserializerAst'
import { createPathRegex, getPathParameterNames } from './pathUtils'
import { Referenceable } from '@oats-ts/json-schema-model'

function getDeserializerOptionProperty(
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

function getDeserializerOptionProperties(parameter: BaseParameterObject): PropertyAssignment[] {
  const { in: location = 'header' } = parameter as ParameterObject
  switch (location) {
    case 'query':
      return [getDeserializerOptionProperty('explode', parameter), getDeserializerOptionProperty('required', parameter)]
    case 'header':
      return [getDeserializerOptionProperty('explode', parameter), getDeserializerOptionProperty('required', parameter)]
    case 'path':
      return [getDeserializerOptionProperty('explode', parameter)]
  }
  return []
}

function getDeserializerOptions(parameter: BaseParameterObject): ObjectLiteralExpression {
  return factory.createObjectLiteralExpression(getDeserializerOptionProperties(parameter).filter(negate(isNil)))
}

function createParameterDeserializer(parameter: BaseParameterObject, context: OpenAPIGeneratorContext): CallExpression {
  const { dereference } = context
  const schema = dereference(parameter.schema)
  const kind = getParameterKind(schema)
  const { in: location = 'header' } = parameter as ParameterObject

  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createPropertyAccessExpression(
        factory.createPropertyAccessExpression(
          factory.createIdentifier(RuntimePackages.ParameterDeserialization.deserializers),
          factory.createIdentifier(location),
        ),
        factory.createIdentifier(getParameterStyle(parameter)),
      ),
      factory.createIdentifier(kind),
    ),
    [],
    [getDeserializerAst(schema, context), getDeserializerOptions(parameter)],
  )
}

function createDeserializerProperty(
  parameter: Referenceable<BaseParameterObject>,
  context: OpenAPIGeneratorContext,
): PropertyAssignment {
  const { dereference } = context
  const name = getParameterName(parameter, context)
  return factory.createPropertyAssignment(
    isIdentifier(name) ? name : factory.createStringLiteral(name),
    createParameterDeserializer(dereference(parameter, true), context),
  )
}

function createDeserializersObject(
  parameters: Referenceable<BaseParameterObject>[],
  context: OpenAPIGeneratorContext,
): ObjectLiteralExpression {
  return factory.createObjectLiteralExpression(
    parameters.map((parameter) => createDeserializerProperty(parameter, context)),
  )
}

export function getParameterDeserializerFactoryCallAst(
  location: ParameterLocation,
  data: EnhancedOperation,
  parameters: Referenceable<BaseParameterObject>[],
  genericType: TypeReferenceType,
  context: OpenAPIGeneratorContext,
): CallExpression {
  return factory.createCallExpression(
    factory.createIdentifier(getParameterDeserializerFactoryName(location)),
    [genericType],
    [
      ...(location === 'path'
        ? [
            factory.createArrayLiteralExpression(
              getPathParameterNames(data.url).map((name) => factory.createStringLiteral(name)),
            ),
            factory.createRegularExpressionLiteral(createPathRegex(data.url).toString()),
          ]
        : []),
      createDeserializersObject(parameters, context),
    ],
  )
}
