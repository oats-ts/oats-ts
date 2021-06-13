import {
  identifier,
  objectExpression,
  Statement,
  variableDeclaration,
  variableDeclarator,
  tsTypeReference,
  ObjectProperty,
  objectProperty,
  numericLiteral,
} from '@babel/types'
import { entries, isNil } from 'lodash'
import { OperationObject, ResponseObject, ResponsesObject } from 'openapi3-ts'
import { BabelModule } from '../../../babel-writer/lib'
import { importAst, typedId, nameAst } from '../babelUtils'
import { OatsModules } from '../packageUtils'
import { OpenAPIGeneratorContext } from '../typings'

function getContentTypeProperties(data: ResponseObject, context: OpenAPIGeneratorContext): ObjectProperty[] {
  const { content } = data
  return entries(content || {}).map(([contentType, mediaTypeObj]) =>
    objectProperty(nameAst(contentType), identifier('undefined')),
  )
}

function getStatusCodeProperties(data: ResponsesObject, context: OpenAPIGeneratorContext): ObjectProperty[] {
  const { default: defaultResponse, ...responses } = data || {}
  const { accessor } = context
  const properties: ObjectProperty[] = []
  properties.push(
    ...entries(responses).map(
      ([statusCode, response]): ObjectProperty =>
        objectProperty(
          numericLiteral(Number(statusCode)),
          objectExpression(getContentTypeProperties(accessor.dereference(response), context)),
        ),
    ),
  )
  if (!isNil(defaultResponse)) {
    properties.push(
      objectProperty(
        identifier('default'),
        objectExpression(getContentTypeProperties(accessor.dereference(defaultResponse), context)),
      ),
    )
  }
  return properties
}

function getParserHintAst(data: OperationObject, context: OpenAPIGeneratorContext): Statement {
  const { accessor } = context
  const varName = typedId(
    accessor.name(data, 'operation-response-parser-hint'),
    tsTypeReference(identifier('ResponseParserHint')),
  )
  return variableDeclaration('const', [
    variableDeclarator(varName, objectExpression(getStatusCodeProperties(data.responses, context))),
  ])
}

export function generateResponseParserHint(data: OperationObject, context: OpenAPIGeneratorContext): BabelModule {
  const { accessor } = context
  return {
    imports: [importAst(OatsModules.Http, ['ResponseParserHint'])],
    path: accessor.path(data, 'operation-response-parser-hint'),
    statements: [getParserHintAst(data, context)],
  }
}
