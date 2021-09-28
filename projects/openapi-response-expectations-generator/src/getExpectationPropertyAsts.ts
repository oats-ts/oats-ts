import { entries } from 'lodash'
import { ResponseObject } from '@oats-ts/openapi-model'
import { Expression, factory, PropertyAssignment } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getExpectationPropertyAsts(
  data: ResponseObject,
  context: OpenAPIGeneratorContext,
): PropertyAssignment[] {
  const { referenceOf } = context
  const { content } = data
  return entries(content || {}).map(([contentType, mediaTypeObj]) => {
    const validator: Expression = referenceOf(mediaTypeObj.schema, 'openapi/validator')
    return factory.createPropertyAssignment(factory.createStringLiteral(contentType), validator)
  })
}
