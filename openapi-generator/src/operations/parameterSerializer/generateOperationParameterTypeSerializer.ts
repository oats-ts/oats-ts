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
  importDeclaration,
  importSpecifier,
  stringLiteral,
  ObjectExpression,
  booleanLiteral,
} from '@babel/types'
import { OperationObject, ParameterObject, ParameterStyle, SchemaObject } from 'openapi3-ts'
import { OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '../../typings'
import { BabelModule } from '@oats-ts/babel-writer'
import { has, head, isNil, negate } from 'lodash'
import { importAst, nameAst } from '../../babelUtils'
import { OatsModules } from '../../packageUtils'

function getSerializerMethod(schema: SchemaObject): 'primitive' | 'object' | 'array' {
  switch (schema.type) {
    case 'array':
      return 'array'
    case 'object':
      return 'object'
    case 'integer':
    case 'string':
    case 'number':
    case 'boolean':
      return 'primitive'
  }
}

function getSerializerName(parameter: ParameterObject) {
  switch (parameter.in) {
    case 'header':
      return 'createHeaderSerializer'
    case 'path':
      return 'createPathSerializer'
    case 'query':
      return 'createQuerySerializer'
    default:
      return undefined
  }
}

function getParameterTypeTarget(parameter: ParameterObject): OpenAPIGeneratorTarget {
  switch (parameter.in) {
    case 'header':
      return 'operation-headers-type'
    case 'path':
      return 'operation-path-type'
    case 'query':
      return 'operation-query-type'
    default:
      return undefined
  }
}
function getParameterSerializerTarget(parameter: ParameterObject): OpenAPIGeneratorTarget {
  switch (parameter.in) {
    case 'header':
      return 'operation-headers-serializer'
    case 'path':
      return 'operation-path-serializer'
    case 'query':
      return 'operation-query-serializer'
    default:
      return undefined
  }
}

function getParameterStyle(parameter: ParameterObject): ParameterStyle {
  switch (parameter.in) {
    case 'header':
      return isNil(parameter.style) ? 'simple' : parameter.style
    case 'path':
      return isNil(parameter.style) ? 'simple' : parameter.style
    case 'query':
      return isNil(parameter.style) ? 'form' : parameter.style
    default:
      return undefined
  }
}

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
      identifier(getSerializerMethod(accessor.dereference(parameter.schema))),
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
  const expr = callExpression(identifier(getSerializerName(paramSample)), [
    ...(paramSample.in === 'path' ? [stringLiteral(url)] : []),
    createSerializersObject(parameters, context),
  ])
  expr.typeParameters = tsTypeParameterInstantiation([
    tsTypeReference(identifier(accessor.name(data, getParameterTypeTarget(paramSample)))),
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
      identifier(accessor.name(data, getParameterSerializerTarget(head(parameters)))),
      createSerializerFactoryCall(url, parameters, data, context),
    ),
  ])
}

function getParameterSerializerImports(parameter: ParameterObject) {
  return importAst(OatsModules.Param, [parameter.in, getSerializerName(parameter)])
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
