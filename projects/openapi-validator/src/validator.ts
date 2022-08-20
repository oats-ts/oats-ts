import { ContentValidator, ValidatorEventEmitter } from '@oats-ts/oats-ts'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OpenAPIValidatorConfig } from './typings'
import { createOpenAPIValidatorConfig } from './createOpenAPIValidatorConfig'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { failure, fluent, fromArray, fromPromiseSettledResult, isSuccess, success, Try } from '@oats-ts/try'
import { tick } from './utils/tick'
import { validateDocument } from './validateDocument'
import { OpenAPIValidatorContextImpl } from './OpenApiValidatorContextImpl'
import { flatMap } from 'lodash'
import { severityComparator } from './severityComparator'
import { isOk } from '@oats-ts/validators'

const name = '@oats-ts/openapi-validator'

export function validator(
  configuration: Partial<OpenAPIValidatorConfig> = {},
): ContentValidator<OpenAPIObject, OpenAPIReadOutput> {
  return async function _validator(
    data: OpenAPIReadOutput,
    emitter: ValidatorEventEmitter<OpenAPIObject>,
  ): Promise<Try<OpenAPIReadOutput>> {
    emitter.emit('validator-step-started', {
      type: 'validator-step-started',
      name,
    })

    await tick()

    const config = createOpenAPIValidatorConfig(configuration)
    const context = new OpenAPIValidatorContextImpl(data)
    const validationResult = await Promise.allSettled(
      context.documents.map((document) => validateDocument(document, context, config, emitter)),
    )
    const results = fluent(fromArray(validationResult.map(fromPromiseSettledResult))).map((data) =>
      flatMap(data).sort(severityComparator),
    )
    const allIssues = Array.from(isSuccess(results) ? results.data : results.issues).sort(severityComparator)
    const hasNoCriticalIssues = isOk(allIssues)
    emitter.emit('validator-step-completed', {
      type: 'validate-step-completed',
      name,
      issues: allIssues,
    })

    return hasNoCriticalIssues ? success(data) : failure(...allIssues)
  }
}
