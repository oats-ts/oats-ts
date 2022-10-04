import { entries } from 'lodash'
import { ContentObject } from '@oats-ts/openapi-model'
import { Expression, factory, PropertyAssignment } from 'typescript'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { RuntimePackages } from '@oats-ts/model-common'

export function getContentTypeBasedValidatorsAst(
  required: boolean,
  content: ContentObject,
  context: OpenAPIGeneratorContext,
): PropertyAssignment[] {
  return entries(content || {}).map(([contentType, mediaTypeObj]) => {
    const expression: Expression = context.referenceOf(mediaTypeObj.schema, 'oats/type-validator')
    const validatorExpr = required
      ? expression
      : factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.optional), [], [expression])
    return factory.createPropertyAssignment(factory.createStringLiteral(contentType), validatorExpr)
  })
}
