import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ReferenceObject, isReferenceObject } from '@oats-ts/json-schema-model'
import { Issue, isOk } from '@oats-ts/validators'
import { isNil } from 'lodash'

export function referenceable<T>(
  validator: OpenAPIValidatorFn<T>,
  forceValidation: boolean = false,
): OpenAPIValidatorFn<T | ReferenceObject> {
  return function _referenceable(
    input: T | ReferenceObject,
    context: OpenAPIValidatorContext,
    config: OpenAPIValidatorConfig,
  ): Issue[] {
    if (!isNil(input) && isReferenceObject(input)) {
      const { referenceObject } = config
      const refIssues = referenceObject(input, context, config)
      if (forceValidation) {
        const { dereference } = context
        return isOk(refIssues) ? [...refIssues, ...validator(dereference<T>(input), context, config)] : refIssues
      }
      return refIssues
    }
    return validator(input, context, config)
  }
}
