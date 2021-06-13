import {
  identifier,
  objectExpression,
  Statement,
  tsTypeReference,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types'
import { typedIdAst } from '../../common/babelUtils'
import { Http } from '../../common/OatsPackages'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getResponseParserHintPropertyAsts } from './getResponseParserHintPropertyAsts'

export function getResponseParserHintAst(data: EnhancedOperation, context: OpenAPIGeneratorContext): Statement {
  const { accessor } = context
  const { operation } = data
  const varName = typedIdAst(
    accessor.name(operation, 'operation-response-parser-hint'),
    tsTypeReference(identifier(Http.ResponseParserHint)),
  )
  return variableDeclaration('const', [
    variableDeclarator(varName, objectExpression(getResponseParserHintPropertyAsts(data, context))),
  ])
}
