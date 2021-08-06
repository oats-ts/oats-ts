import { ParameterLocation, ParameterObject } from '@oats-ts/openapi-model'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { has, isNil, negate } from 'lodash'
import { getParameterSerializerMethod } from './getParameterSerializerMethod'
import { getParameterStyle } from './getParameterStyle'
import { getParameterSerializerFactoryName } from './getParameterSerializerFactoryName'
import { RuntimePackages } from '@oats-ts/openapi-common'
import { EnhancedOperation } from '@oats-ts/openapi-common'
import {
  CallExpression,
  factory,
  NodeFlags,
  ObjectLiteralExpression,
  PropertyAssignment,
  SyntaxKind,
  VariableStatement,
} from 'typescript'
import { getNamedImports, getRelativeImports, isIdentifier } from '@oats-ts/typescript-common'
import { getParameterTypeGeneratorTarget } from './getParameterTypeGeneratorTarget'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'

function getSerializerOptionProperty(key: keyof ParameterObject, parameter: ParameterObject): PropertyAssignment {
  return has(parameter, key)
    ? factory.createPropertyAssignment(
        factory.createIdentifier(key.toString()),
        Boolean(parameter[key]) ? factory.createTrue() : factory.createFalse(),
      )
    : undefined
}

function getSerializerOptionProperties(parameter: ParameterObject): PropertyAssignment[] {
  switch (parameter.in) {
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

function getSerializerOptions(parameter: ParameterObject): ObjectLiteralExpression {
  return factory.createObjectLiteralExpression(getSerializerOptionProperties(parameter).filter(negate(isNil)))
}

function createParameterSerializer(parameter: ParameterObject, context: OpenAPIGeneratorContext): CallExpression {
  const { dereference } = context
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier(parameter.in), getParameterStyle(parameter)),
      getParameterSerializerMethod(dereference(parameter.schema)),
    ),
    [],
    [getSerializerOptions(parameter)],
  )
}

function createSerializerProperty(parameter: ParameterObject, context: OpenAPIGeneratorContext): PropertyAssignment {
  return factory.createPropertyAssignment(
    isIdentifier(parameter.name) ? parameter.name : factory.createStringLiteral(parameter.name),
    createParameterSerializer(parameter, context),
  )
}

function createSerializersObject(
  parameters: ParameterObject[],
  context: OpenAPIGeneratorContext,
): ObjectLiteralExpression {
  return factory.createObjectLiteralExpression(
    parameters.map((parameter) => createSerializerProperty(parameter, context)),
  )
}

function createSerializerFactoryCall(
  location: ParameterLocation,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): CallExpression {
  const { nameOf } = context
  const parameters = data[location]

  return factory.createCallExpression(
    factory.createIdentifier(getParameterSerializerFactoryName(location)),
    [factory.createTypeReferenceNode(nameOf(data.operation, getParameterTypeGeneratorTarget(location)))],
    [
      ...(location === 'path' ? [factory.createStringLiteral(data.url)] : []),
      createSerializersObject(parameters, context),
    ],
  )
}

function createSerializerConstant(
  location: ParameterLocation,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
  target: OpenAPIGeneratorTarget,
): VariableStatement {
  const { nameOf } = context
  return factory.createVariableStatement(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          nameOf(data.operation, target),
          undefined,
          undefined,
          createSerializerFactoryCall(location, data, context),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}

const generateOperationParameterTypeSerializer =
  (location: ParameterLocation, target: OpenAPIGeneratorTarget, typeTarget: OpenAPIGeneratorTarget) =>
  (data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeScriptModule => {
    const parameters = data[location]
    const { pathOf, dependenciesOf } = context
    if (parameters.length === 0) {
      return undefined
    }
    const serializerPath = pathOf(data.operation, target)
    return {
      path: serializerPath,
      dependencies: [
        getNamedImports(RuntimePackages.ParameterSerialization.name, [
          location,
          getParameterSerializerFactoryName(location),
        ]),
        ...dependenciesOf(serializerPath, data.operation, typeTarget),
      ],
      content: [createSerializerConstant(location, data, context, target)],
    }
  }

export const generateQueryParameterTypeSerializer = generateOperationParameterTypeSerializer(
  'query',
  'openapi/query-serializer',
  'openapi/query-type',
)
export const generatePathParameterTypeSerializer = generateOperationParameterTypeSerializer(
  'path',
  'openapi/path-serializer',
  'openapi/path-type',
)
export const generateHeaderParameterTypeSerializer = generateOperationParameterTypeSerializer(
  'header',
  'openapi/headers-serializer',
  'openapi/headers-type',
)
