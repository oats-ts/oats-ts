import { identifier, numericLiteral, objectExpression, ObjectProperty, objectProperty } from '@babel/types'
import { entries, isNil } from 'lodash'
import { OpenAPIGeneratorContext } from '../../typings'
import { EnhancedOperation } from '../typings'
import { getContentValidatorPropertyAsts } from './getContentValidatorPropertyAsts'

export function getResponseParserHintPropertyAsts(
  data: EnhancedOperation,
  context: OpenAPIGeneratorContext,
): ObjectProperty[] {
  const { operation } = data
  const { default: defaultResponse, ...responses } = operation.responses || {}
  const { accessor } = context
  const properties: ObjectProperty[] = []
  properties.push(
    ...entries(responses).map(
      ([statusCode, response]): ObjectProperty =>
        objectProperty(
          numericLiteral(Number(statusCode)),
          objectExpression(getContentValidatorPropertyAsts(accessor.dereference(response), context)),
        ),
    ),
  )
  if (!isNil(defaultResponse)) {
    properties.push(
      objectProperty(
        identifier('default'),
        objectExpression(getContentValidatorPropertyAsts(accessor.dereference(defaultResponse), context)),
      ),
    )
  }
  return properties
}
