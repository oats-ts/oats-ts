import { entries } from 'lodash'
import { ContentObject } from '@oats-ts/openapi-model'
import { Expression, factory, PropertyAssignment } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getContentTypeBasedValidatorsAst(
  content: ContentObject,
  context: OpenAPIGeneratorContext,
): PropertyAssignment[] {
  const { referenceOf } = context
  return entries(content || {}).map(([contentType, mediaTypeObj]) => {
    const validator: Expression = referenceOf(mediaTypeObj.schema, 'openapi/type-validator')
    return factory.createPropertyAssignment(factory.createStringLiteral(contentType), validator)
  })
}
