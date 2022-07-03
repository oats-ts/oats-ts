import { ContentValidator } from '@oats-ts/oats'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OpenAPIValidatorConfig } from './typings'
import { createOpenAPIValidatorConfig } from './createOpenAPIValidatorConfig'
import { createOpenAPIValidatorContext } from './createOpenAPIValidatorContext'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { fluent, fromArray, fromPromiseSettledResult, isSuccess, Try } from '@oats-ts/try'
import { ValidatorEventEmitter } from '@oats-ts/events'
import { tick } from './utils/tick'
import { validateDocument } from './validateDocument'

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
    const context = createOpenAPIValidatorContext(data)
    const validationResult = await Promise.allSettled(
      context.documents.map((document) => validateDocument(document, context, config, emitter)),
    )
    const results = fluent(
      fromArray(validationResult.map(fromPromiseSettledResult).map((wrapped) => fluent(wrapped).flatMap((t) => t))),
    ).map(() => data)

    emitter.emit('validator-step-completed', {
      type: 'validate-step-completed',
      name,
      issues: isSuccess(results) ? [] : results.issues,
    })

    return results
  }
}
