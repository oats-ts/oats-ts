import { OpenAPIValidatorConfig, OpenAPIValidatorContext, OpenAPIValidatorFn } from '../typings'
import { ReferenceObject } from '@oats-ts/json-schema-model'
import { isReferenceObject } from '@oats-ts/model-common'
import { Issue, isOk } from '@oats-ts/validators'
import { isNil } from 'lodash'
import { referenceObject } from './referenceObject'

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
      const refIssues = config.referenceObject(input, context, config)
      if (forceValidation) {
        return isOk(refIssues)
          ? [...refIssues, ...validator(context.dereference<T>(input), context, config)]
          : refIssues
      }
      return refIssues
    }
    return validator(input, context, config)
  }
}
