import { Issue } from '@oats-ts/validators'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { flatMap } from 'lodash'
import { ParameterSegment, parsePathToSegments, PathSegment } from '@oats-ts/openapi-parameter-serialization'
import { PathItemObject, ParameterObject } from '@oats-ts/openapi-model'
import { ReferenceObject } from '@oats-ts/json-schema-model'
import { operationsOf } from '../utils/modelUtils'

function getPathParams(params: (ParameterObject | ReferenceObject)[], context: OpenAPIValidatorContext) {
  const { dereference } = context
  return (params || []).map((param) => dereference<ParameterObject>(param)).filter((param) => param.in === 'path')
}

export function pathItemObjectUrl(
  url: string,
  data: PathItemObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  let segments: PathSegment[]
  const { uriOf } = context
  try {
    segments = parsePathToSegments(url)
  } catch (e) {
    return [
      {
        message: `invalid path: "${url}" (${e.message})`,
        path: uriOf(data),
        severity: 'error',
        type: 'other',
      },
    ]
  }
  const pathSegments = segments.filter(({ type }) => type === 'parameter') as ParameterSegment[]
  const commonPathParams = getPathParams(data.parameters, context)
  const operations = operationsOf(data)
  return flatMap(operations, (operation): Issue[] => {
    const params = commonPathParams.concat(getPathParams(operation.parameters, context))
    const missing = pathSegments
      .filter((segment) => !params.some((param) => param.name === segment.name))
      .map(
        (segment): Issue => ({
          message: `parameter "${segment.name}" is missing`,
          path: uriOf(operation),
          severity: 'error',
          type: 'other',
        }),
      )
    const extra = params
      .filter((param) => !pathSegments.some((segment) => segment.name === param.name))
      .map(
        (param): Issue => ({
          message: `parameter "${param.name}" is not defined in "${url}"`,
          path: uriOf(operation),
          severity: 'error',
          type: 'other',
        }),
      )
    return [...missing, ...extra]
  })
}
