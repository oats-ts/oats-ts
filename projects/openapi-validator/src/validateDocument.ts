import { ValidatorEventEmitter } from '@oats-ts/events'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { failure, success, Try } from '@oats-ts/try'
import { severityComparator } from './severityComparator'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from './typings'
import { tick } from './utils/tick'

export async function validateDocument(
  document: OpenAPIObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
  emitter: ValidatorEventEmitter<OpenAPIObject>,
): Promise<Try<OpenAPIObject>> {
  emitter.emit('validate-file-started', {
    type: 'validate-file-started',
    path: context.uriOf(document),
    data: document,
  })

  await tick()

  const issues = config.openApiObject(document, context, config).sort(severityComparator)
  const result = issues.every((issue) => issue.severity !== 'error') ? success(document) : failure(issues)

  await tick()

  emitter.emit('validate-file-completed', {
    type: 'validate-file-completed',
    path: context.uriOf(document),
    data: result,
    issues,
  })

  await tick()

  return result
}
