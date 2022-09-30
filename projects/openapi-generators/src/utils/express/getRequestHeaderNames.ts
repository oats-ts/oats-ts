import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { OperationObject } from '@oats-ts/openapi-model'
import { isNil } from 'lodash'

export function getRequestHeaderNames(
  operation: OperationObject | undefined,
  context: OpenAPIGeneratorContext,
): string[] {
  if (isNil(operation)) {
    return []
  }
  const params = (operation.parameters ?? []).map((param) => context.dereference(param, true))
  const headers = params.filter((param) => param.in === 'header').map((param) => param.name?.toLowerCase())
  if (!isNil(operation.requestBody)) {
    headers.push('content-type')
  }
  if (params.some((param) => param.in === 'cookie')) {
    headers.push('cookie')
  }
  return headers
}
