import { ValidatorEventEmitter } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { failure, success } from '@oats-ts/try'
import { isOk, Issue } from '@oats-ts/validators'
import { severityComparator } from './severityComparator'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from './typings'
import { tick } from './utils/tick'

export async function validateDocument(
  document: OpenAPIObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
  emitter: ValidatorEventEmitter<OpenAPIObject>,
): Promise<Issue[]> {
  emitter.emit('validate-file-started', {
    type: 'validate-file-started',
    path: context.uriOf(document),
    data: document,
  })

  await tick()

  const issues = config.openApiObject(document, context, config).sort(severityComparator)
  const hasNoCriticalIssue = isOk(issues)
  const result = hasNoCriticalIssue ? success(document) : failure(...issues)

  await tick()

  emitter.emit('validate-file-completed', {
    type: 'validate-file-completed',
    path: context.uriOf(document),
    data: result,
    issues,
  })

  await tick()

  return issues
}
