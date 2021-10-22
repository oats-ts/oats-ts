import { ParameterLocation, ParameterObject } from '@oats-ts/openapi-model'
import { getParameterKind, getParameterStyle, OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { has, isNil, negate } from 'lodash'
import { getParameterDeserializerFactoryName } from './getParameterDeserializerFactoryName'
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
import { getNamedImports, isIdentifier } from '@oats-ts/typescript-common'
import { getParameterTypeGeneratorTarget } from './getParameterTypeGeneratorTarget'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { getDeserializerAst } from './getDeserializerAst'
import { createPathRegex, getPathParameterNames } from './pathUtils'

function getDeserializerOptionProperty(key: keyof ParameterObject, parameter: ParameterObject): PropertyAssignment {
  return has(parameter, key)
    ? factory.createPropertyAssignment(
        factory.createIdentifier(key.toString()),
        Boolean(parameter[key]) ? factory.createTrue() : factory.createFalse(),
      )
    : undefined
}

function getDeserializerOptionProperties(parameter: ParameterObject): PropertyAssignment[] {
  switch (parameter.in) {
    case 'query':
      return [getDeserializerOptionProperty('explode', parameter), getDeserializerOptionProperty('required', parameter)]
    case 'header':
      return [getDeserializerOptionProperty('explode', parameter), getDeserializerOptionProperty('required', parameter)]
    case 'path':
      return [getDeserializerOptionProperty('explode', parameter)]
  }
  return []
}

function getDeserializerOptions(parameter: ParameterObject): ObjectLiteralExpression {
  return factory.createObjectLiteralExpression(getDeserializerOptionProperties(parameter).filter(negate(isNil)))
}

function createParameterDeserializer(parameter: ParameterObject, context: OpenAPIGeneratorContext): CallExpression {
  const { dereference } = context
  const schema = dereference(parameter.schema)
  const kind = getParameterKind(schema)

  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier(parameter.in), getParameterStyle(parameter)),
      kind,
    ),
    [],
    [getDeserializerAst(schema, context), getDeserializerOptions(parameter)],
  )
}

function createDeserializerProperty(parameter: ParameterObject, context: OpenAPIGeneratorContext): PropertyAssignment {
  return factory.createPropertyAssignment(
    isIdentifier(parameter.name) ? parameter.name : factory.createStringLiteral(parameter.name),
    createParameterDeserializer(parameter, context),
  )
}

function createDeserializersObject(
  parameters: ParameterObject[],
  context: OpenAPIGeneratorContext,
): ObjectLiteralExpression {
  return factory.createObjectLiteralExpression(
    parameters.map((parameter) => createDeserializerProperty(parameter, context)),
  )
}

function createDeserializerFactoryCall(
  location: ParameterLocation,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): CallExpression {
  const { nameOf } = context
  const parameters = data[location]

  return factory.createCallExpression(
    factory.createIdentifier(getParameterDeserializerFactoryName(location)),
    [factory.createTypeReferenceNode(nameOf(data.operation, getParameterTypeGeneratorTarget(location)))],
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

function createDeserializerConstant(
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
          createDeserializerFactoryCall(location, data, context),
        ),
      ],
      NodeFlags.Const,
    ),
  )
}

const generateOperationParameterTypeDeserializer =
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
        getNamedImports(RuntimePackages.ParameterDeserialization.name, [
          getParameterDeserializerFactoryName(location),
          location,
          // Primitive deserialization is needed in any case.
          RuntimePackages.ParameterDeserialization.value,
        ]),
        ...dependenciesOf(serializerPath, data.operation, typeTarget),
      ],
      content: [createDeserializerConstant(location, data, context, target)],
    }
  }

export const generateQueryParameterTypeDeserializer = generateOperationParameterTypeDeserializer(
  'query',
  'openapi/query-deserializer',
  'openapi/query-type',
)
export const generatePathParameterTypeDeserializer = generateOperationParameterTypeDeserializer(
  'path',
  'openapi/path-deserializer',
  'openapi/path-type',
)
export const generateHeaderParameterTypeDeserializer = generateOperationParameterTypeDeserializer(
  'header',
  'openapi/request-headers-deserializer',
  'openapi/request-headers-type',
)
