import { entries } from 'lodash'
import { ResponseObject } from '@oats-ts/openapi-model'
import { Expression, factory, PropertyAssignment } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { OperationsGeneratorConfig } from '../typings'

export function getExpectationPropertyAsts(
  data: ResponseObject,
  context: OpenAPIGeneratorContext,
  config: OperationsGeneratorConfig,
): PropertyAssignment[] {
  const { referenceOf } = context
  const { content } = data
  return entries(content || {}).map(([contentType, mediaTypeObj]) => {
    const validator: Expression = config.validate
      ? referenceOf(mediaTypeObj.schema, 'openapi/validator')
      : factory.createIdentifier('undefined')
    return factory.createPropertyAssignment(factory.createStringLiteral(contentType), validator)
  })
}
