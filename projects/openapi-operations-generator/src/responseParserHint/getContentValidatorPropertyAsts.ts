import { entries } from 'lodash'
import { ResponseObject } from 'openapi3-ts/dist/model/OpenApi'
import { Expression, factory, PropertyAssignment } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { OperationsGeneratorConfig } from '../typings'

export function getContentValidatorPropertyAsts(
  data: ResponseObject,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): PropertyAssignment[] {
  const { accessor } = context
  const { content } = data
  return entries(content || {}).map(([contentType, mediaTypeObj]) => {
    const validator: Expression = config.validate
      ? accessor.reference(mediaTypeObj.schema, 'openapi/validator')
      : factory.createIdentifier('undefined')
    return factory.createPropertyAssignment(factory.createStringLiteral(contentType), validator)
  })
}
