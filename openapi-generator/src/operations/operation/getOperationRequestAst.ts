import {
  AwaitExpression,
  awaitExpression,
  callExpression,
  identifier,
  memberExpression,
  objectExpression,
  objectProperty,
  ObjectProperty,
  SpreadElement,
  spreadElement,
  stringLiteral,
} from '@babel/types'
import { entries } from 'lodash'
import { idAst } from '../../common/babelUtils'
import { OpenAPIGeneratorContext } from '../../typings'
import { getRequestBodyContent } from '../inputType/getRequestBodyContent'
import { EnhancedOperation } from '../typings'
import { getParameterSerializerCallAst } from './getParameterSerializerCallAst'
import { getUrlAst } from './getUrlAst'

function getHeadersParameter(data: EnhancedOperation, context: OpenAPIGeneratorContext): ObjectProperty {
  const { accessor } = context
  const { header } = data
  const bodies = entries(getRequestBodyContent(data, context))
  const headerSerializerAst = getParameterSerializerCallAst(
    accessor.name(data, 'operation-headers-serializer'),
    'headers',
  )
  if (header.length > 0 && bodies.length === 0) {
    return objectProperty(idAst('headers'), headerSerializerAst)
  }
  if (bodies.length > 0) {
    const properties: (ObjectProperty | SpreadElement)[] = []
    if (header.length > 0) {
      properties.push(spreadElement(headerSerializerAst))
    }
    properties.push(
      objectProperty(stringLiteral('content-type'), memberExpression(identifier('input'), identifier('contentType'))),
    )
    return objectProperty(idAst('headers'), objectExpression(properties))
  }
  return undefined
}

export function getOperationRequestAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): AwaitExpression {
  const { method, header } = data
  const bodies = entries(getRequestBodyContent(data, context))

  const properties: ObjectProperty[] = [
    objectProperty(idAst('url'), getUrlAst(data, context)),
    objectProperty(idAst('method'), stringLiteral(method)),
  ]

  if (bodies.length > 1) {
    properties.push(
      objectProperty(
        idAst('body'),
        awaitExpression(
          callExpression(memberExpression(identifier('config'), identifier('serialize')), [
            memberExpression(identifier('input'), identifier('contentType')),
            memberExpression(identifier('input'), identifier('body')),
          ]),
        ),
      ),
    )
  }

  if (bodies.length > 0 || header.length > 0) {
    properties.push(getHeadersParameter(data, context))
  }

  return awaitExpression(
    callExpression(memberExpression(identifier('config'), identifier('request')), [objectExpression(properties)]),
  )
}
