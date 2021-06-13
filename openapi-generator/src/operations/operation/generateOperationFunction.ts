import {
  awaitExpression,
  blockStatement,
  callExpression,
  exportNamedDeclaration,
  Expression,
  functionDeclaration,
  identifier,
  memberExpression,
  objectExpression,
  objectProperty,
  returnStatement,
  Statement,
  stringLiteral,
  tsTypeAnnotation,
  tsTypeParameterInstantiation,
  tsTypeReference,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types'
import { OperationObject, ParameterLocation } from 'openapi3-ts'
import { OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '../../typings'
import type { HttpMethod } from '@oats-ts/http'
import { BabelModule } from '../../../../babel-writer/lib'
import { getOperationReturnTypeImports, getOperationReturnTypeReference } from '../returnType/generateOperationReturnType'
import { PartitionedParameters } from '../getEnhancedOperation'
import { isNil, negate } from 'lodash'
import { importAst, nameAst, typedId } from '../../babelUtils'
import { OatsModules } from '../../packageUtils'

function getSerializedParamExpr(
  data: OperationObject,
  location: string,
  target: OpenAPIGeneratorTarget,
  context: OpenAPIGeneratorContext,
): Expression {
  return callExpression(identifier(context.accessor.name(data, target)), [
    memberExpression(identifier('input'), identifier(location)),
  ])
}

function getUrlExpression(
  url: string,
  data: OperationObject,
  parameters: PartitionedParameters,
  context: OpenAPIGeneratorContext,
): Expression {
  const baseUrlExpr = memberExpression(identifier('config'), identifier('baseUrl'))
  const pathExpr =
    parameters.path.length === 0
      ? stringLiteral(url)
      : getSerializedParamExpr(data, 'path', 'operation-path-serializer', context)
  const queryExpr =
    parameters.path.length === 0
      ? undefined
      : getSerializedParamExpr(data, 'query', 'operation-query-serializer', context)

  return callExpression(identifier('joinUrl'), [baseUrlExpr, pathExpr, queryExpr].filter(negate(isNil)))
}

function getHeadersExpression(data: OperationObject, context: OpenAPIGeneratorContext): Expression {
  return getSerializedParamExpr(data, 'headers', 'operation-headers-serializer', context)
}

function getResponseExpression(
  url: string,
  method: HttpMethod,
  data: OperationObject,
  parameters: PartitionedParameters,
  context: OpenAPIGeneratorContext,
): Expression {
  getHeadersExpression(data, context)
  return awaitExpression(
    callExpression(memberExpression(identifier('config'), identifier('request')), [
      objectExpression([
        objectProperty(nameAst('url'), getUrlExpression(url, data, parameters, context)),
        objectProperty(nameAst('method'), stringLiteral(method)),
        ...(parameters.header.length === 0
          ? []
          : [objectProperty(nameAst('headers'), getHeadersExpression(data, context))]),
      ]),
    ]),
  )
}

function getReturnExpression(
  url: string,
  method: HttpMethod,
  data: OperationObject,
  parameters: PartitionedParameters,
  context: OpenAPIGeneratorContext,
): Expression {
  return callExpression(memberExpression(identifier('config'), identifier('parse')), [
    getResponseExpression(url, method, data, parameters, context),
    identifier(context.accessor.name(data, 'operation-response-parser-hint')),
  ])
}

export function generateOperationFunction(
  url: string,
  method: HttpMethod,
  parameters: PartitionedParameters,
  data: OperationObject,
  context: OpenAPIGeneratorContext,
): BabelModule {
  const { accessor } = context

  const configParameter = typedId('config', tsTypeReference(identifier('RequestConfig')))

  const inputParameter = typedId('input', tsTypeReference(identifier(accessor.name(data, 'operation-input-type'))))

  const fn = functionDeclaration(
    identifier(data.operationId),
    [configParameter, inputParameter],
    blockStatement([returnStatement(getReturnExpression(url, method, data, parameters, context))]),
    false,
    true,
  )
  fn.returnType = tsTypeAnnotation(
    tsTypeReference(
      identifier('Promise'),
      tsTypeParameterInstantiation([
        tsTypeReference(
          identifier('HttpResponse'),
          tsTypeParameterInstantiation([getOperationReturnTypeReference(data, context)]),
        ),
      ]),
    ),
  )
  const ast = exportNamedDeclaration(fn)
  return {
    imports: [
      importAst(OatsModules.Param, ['joinUrl']),
      importAst(OatsModules.Http, ['RequestConfig', 'HttpResponse']),
      ...getOperationReturnTypeImports(data, context),
    ],
    path: accessor.path(data, 'operation'),
    statements: [ast],
  }
}
