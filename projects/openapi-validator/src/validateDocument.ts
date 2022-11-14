import { ValidatorEventEmitter } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { failure, success } from '@oats-ts/try'
import { isOk, Issue } from '@oats-ts/validators'
import { severityComparator } from './severityComparator'
import { OpenAPIValidator, OpenAPIValidatorContext } from './typings'
import { tick } from '@oats-ts/model-common'

export async function validateDocument(
  document: OpenAPIObject,
  context: OpenAPIValidatorContext,
  validator: OpenAPIValidator,
  emitter: ValidatorEventEmitter<OpenAPIObject>,
): Promise<Issue[]> {
  emitter.emit('validate-file-started', {
    type: 'validate-file-started',
    path: context.uriOf(document),
    data: document,
  })

  await tick()
  let issues: Issue[] = []
  try {
    issues = validator.validate(document).sort(severityComparator)
  } catch (e) {
    console.error(e)
  }
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
