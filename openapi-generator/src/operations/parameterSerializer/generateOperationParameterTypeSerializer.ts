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
import { OperationObject, ParameterObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext } from '../../typings'
import { BabelModule } from '@oats-ts/babel-writer'
import { has, head, isNil, negate } from 'lodash'
import { importAst, nameAst } from '../../babelUtils'
import { OatsModules } from '../../packageUtils'
import { getParameterSerializerMethod } from './getParameterSerializerMethod'
import { getParameterStyle } from './getParameterStyle'
import { getParameterSerializerGeneratorTarget } from './getParameterSerializerGeneratorTarget'
import { getParameterTypeGeneratorTarget } from '../parameterType/getParameterTypeGeneratorTarget'
import { getParameterSerializerFactoryName } from './getParameterSerializerFactoryName'

function getSerializerOptionProperty(key: keyof ParameterObject, parameter: ParameterObject): ObjectProperty {
  return has(parameter, key)
    ? objectProperty(nameAst(key.toString()), booleanLiteral(Boolean(parameter[key])))
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
  return objectProperty(nameAst(parameter.name), createParameterSerializer(parameter, context))
}

function createSerializersObject(parameters: ParameterObject[], context: OpenAPIGeneratorContext): Expression {
  return objectExpression(parameters.map((parameter) => createSerializerProperty(parameter, context)))
}

function createSerializerFactoryCall(
  url: string,
  parameters: ParameterObject[],
  data: OperationObject,
  context: OpenAPIGeneratorContext,
): CallExpression {
  const { accessor } = context
  const paramSample = head(parameters)
  const expr = callExpression(identifier(getParameterSerializerFactoryName(paramSample.in)), [
    ...(paramSample.in === 'path' ? [stringLiteral(url)] : []),
    createSerializersObject(parameters, context),
  ])
  expr.typeParameters = tsTypeParameterInstantiation([
    tsTypeReference(identifier(accessor.name(data, getParameterTypeGeneratorTarget(paramSample.in)))),
  ])
  return expr
}

function createSerializerConstant(
  url: string,
  parameters: ParameterObject[],
  data: OperationObject,
  context: OpenAPIGeneratorContext,
) {
  const { accessor } = context
  return variableDeclaration('const', [
    variableDeclarator(
      identifier(accessor.name(data, getParameterSerializerGeneratorTarget(head(parameters).in))),
      createSerializerFactoryCall(url, parameters, data, context),
    ),
  ])
}

function getParameterSerializerImports(parameter: ParameterObject) {
  return importAst(OatsModules.Param, [parameter.in, getParameterSerializerFactoryName(parameter.in)])
}

export function generateOperationParameterTypeSerializer(
  url: string,
  parameters: ParameterObject[],
  data: OperationObject,
  context: OpenAPIGeneratorContext,
): BabelModule {
  const { accessor } = context
  if (parameters.length === 0) {
    return undefined
  }
  return {
    imports: [getParameterSerializerImports(head(parameters))],
    path: accessor.path(data, 'operation'),
    statements: [createSerializerConstant(url, parameters, data, context)],
  }
}
