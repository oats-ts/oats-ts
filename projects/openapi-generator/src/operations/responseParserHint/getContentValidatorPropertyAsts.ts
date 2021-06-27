import { entries } from 'lodash'
import { ResponseObject } from 'openapi3-ts/dist/model/OpenApi'
import { factory, PropertyAssignment } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export function getContentValidatorPropertyAsts(
  data: ResponseObject,
  context: OpenAPIGeneratorContext,
): PropertyAssignment[] {
  const { content } = data
  return entries(content || {}).map(([contentType]) =>
    factory.createPropertyAssignment(factory.createStringLiteral(contentType), factory.createIdentifier('undefined')),
  )
}
