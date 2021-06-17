import {
  callExpression,
  identifier,
  objectExpression,
  objectProperty,
  tsTypeParameterInstantiation,
  tsTypeReference,
  variableDeclaration,
  variableDeclarator,
  memberExpression,
  Expression,
  CallExpression,
  ObjectProperty,
  stringLiteral,
  ObjectExpression,
  booleanLiteral,
} from '@babel/types'
import { OperationObject, ParameterLocation, ParameterObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { BabelModule } from '@oats-ts/babel-writer'
import { has, isNil, negate } from 'lodash'
import { importAst, idAst } from '../../common/babelUtils'
import { getParameterSerializerMethod } from './getParameterSerializerMethod'
import { getParameterStyle } from './getParameterStyle'
import { getParameterSerializerGeneratorTarget } from './getParameterSerializerGeneratorTarget'
import { getParameterTypeGeneratorTarget } from '../parameterType/getParameterTypeGeneratorTarget'
import { getParameterSerializerFactoryName } from './getParameterSerializerFactoryName'
import { Params } from '../../common/OatsPackages'
import { EnhancedOperation } from '../typings'

function getSerializerOptionProperty(key: keyof ParameterObject, parameter: ParameterObject): ObjectProperty {
  return has(parameter, key)
    ? objectProperty(idAst(key.toString()), booleanLiteral(Boolean(parameter[key])))
    : undefined
}

function getSerializerOptionProperties(parameter: ParameterObject): ObjectProperty[] {
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

function getSerializerOptions(parameter: ParameterObject): ObjectExpression {
  return objectExpression(getSerializerOptionProperties(parameter).filter(negate(isNil)))
}

function createParameterSerializer(parameter: ParameterObject, context: OpenAPIGeneratorContext): CallExpression {
  const { accessor } = context
  return callExpression(
    memberExpression(
      memberExpression(identifier(parameter.in), identifier(getParameterStyle(parameter))),
      identifier(getParameterSerializerMethod(accessor.dereference(parameter.schema))),
    ),
    [getSerializerOptions(parameter)],
  )
}

function createSerializerProperty(parameter: ParameterObject, context: OpenAPIGeneratorContext): ObjectProperty {
  return objectProperty(idAst(parameter.name), createParameterSerializer(parameter, context))
}

function createSerializersObject(parameters: ParameterObject[], context: OpenAPIGeneratorContext): Expression {
  return objectExpression(parameters.map((parameter) => createSerializerProperty(parameter, context)))
}

function createSerializerFactoryCall(
  location: ParameterLocation,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): CallExpression {
  const { accessor } = context
  const parameters = data[location]
  const expr = callExpression(identifier(getParameterSerializerFactoryName(location)), [
    ...(location === 'path' ? [stringLiteral(data.url)] : []),
    createSerializersObject(parameters, context),
  ])
  expr.typeParameters = tsTypeParameterInstantiation([
    tsTypeReference(identifier(accessor.name(data, getParameterTypeGeneratorTarget(location)))),
  ])
  return expr
}

function createSerializerConstant(
  location: ParameterLocation,
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
) {
  const { accessor } = context
  return variableDeclaration('const', [
    variableDeclarator(
      identifier(accessor.name(data.operation, getParameterSerializerGeneratorTarget(location))),
      createSerializerFactoryCall(location, data, context),
    ),
  ])
}

const generateOperationParameterTypeSerializer =
  (location: ParameterLocation) =>
  (data: EnhancedOperation, context: OpenAPIGeneratorContext): BabelModule => {
    const parameters = data[location]
    const { accessor } = context
    if (parameters.length === 0) {
      return undefined
    }
    return {
      imports: [importAst(Params.name, [location, getParameterSerializerFactoryName(location)])],
      path: accessor.path(data.operation, 'operation'),
      statements: [createSerializerConstant(location, data, context)],
    }
  }

export const generateQueryParameterTypeSerializer = generateOperationParameterTypeSerializer('query')
export const generatePathParameterTypeSerializer = generateOperationParameterTypeSerializer('path')
export const generateHeaderParameterTypeSerializer = generateOperationParameterTypeSerializer('header')
