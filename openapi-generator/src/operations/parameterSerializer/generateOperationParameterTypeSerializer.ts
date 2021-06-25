import { ParameterLocation, ParameterObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { has, isNil, negate } from 'lodash'
import { getParameterSerializerMethod } from './getParameterSerializerMethod'
import { getParameterStyle } from './getParameterStyle'
import { getParameterSerializerGeneratorTarget } from './getParameterSerializerGeneratorTarget'
import { getParameterTypeGeneratorTarget } from '../../parameterTypes/getParameterTypeGeneratorTarget'
import { getParameterSerializerFactoryName } from './getParameterSerializerFactoryName'
import { Params } from '../../common/OatsPackages'
import { EnhancedOperation } from '../typings'
import {
  CallExpression,
  factory,
  NodeFlags,
  ObjectLiteralExpression,
  PropertyAssignment,
  VariableStatement,
} from 'typescript'
import { tsExportModifier, tsImportAst } from '../../common/typeScriptUtils'
import { isIdentifier } from '../../common/isIdentifier'

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
  const { accessor } = context
  return factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createPropertyAccessExpression(factory.createIdentifier(parameter.in), getParameterStyle(parameter)),
      getParameterSerializerMethod(accessor.dereference(parameter.schema)),
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
  const { accessor } = context
  const parameters = data[location]

  return factory.createCallExpression(
    factory.createIdentifier(getParameterSerializerFactoryName(location)),
    [factory.createTypeReferenceNode(accessor.name(data.operation, getParameterTypeGeneratorTarget(location)))],
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
): VariableStatement {
  const { accessor } = context
  return factory.createVariableStatement(
    [tsExportModifier()],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          accessor.name(data.operation, getParameterSerializerGeneratorTarget(location)),
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
  (location: ParameterLocation) =>
  (data: EnhancedOperation, context: OpenAPIGeneratorContext): TypeScriptModule => {
    const parameters = data[location]
    const { accessor } = context
    if (parameters.length === 0) {
      return undefined
    }
    return {
      path: accessor.path(data.operation, 'operation'),
      dependencies: [tsImportAst(Params.name, [location, getParameterSerializerFactoryName(location)])],
      content: [createSerializerConstant(location, data, context)],
    }
  }

export const generateQueryParameterTypeSerializer = generateOperationParameterTypeSerializer('query')
export const generatePathParameterTypeSerializer = generateOperationParameterTypeSerializer('path')
export const generateHeaderParameterTypeSerializer = generateOperationParameterTypeSerializer('header')
