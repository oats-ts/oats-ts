import { ParameterSegment, parsePathToSegments, PathSegment } from '@oats-ts/openapi-parameter-serialization'
import { PathItemObject, ParameterObject, ReferenceObject } from 'openapi3-ts'
import { Issue } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { getOperations } from './getOperations'
import { flatMap } from 'lodash'

function getPathParams(params: (ParameterObject | ReferenceObject)[], context: OpenAPIGeneratorContext) {
  return (params || []).map((param) => context.accessor.dereference(param)).filter((param) => param.in === 'path')
}

export function validateUrl(urlTemplate: string, path: PathItemObject, context: OpenAPIGeneratorContext): Issue[] {
  let segments: PathSegment[]
  const { accessor } = context
  try {
    segments = parsePathToSegments(urlTemplate)
  } catch (e) {
    return [
      {
        message: `invalid path: "${urlTemplate}" (${e.message})`,
        path: accessor.uri(path),
        severity: 'error',
        type: 'other',
      },
    ]
  }
  const pathSegments = segments.filter(({ type }) => type === 'parameter') as ParameterSegment[]
  const commonPathParams = getPathParams(path.parameters, context)
  const operations = getOperations(path)
  return flatMap(operations, (operation): Issue[] => {
    const params = commonPathParams.concat(getPathParams(operation.parameters, context))
    const missing = pathSegments
      .filter((segment) => !params.some((param) => param.name === segment.name))
      .map(
        (segment): Issue => ({
          message: `parameter "${segment.name}" is missing`,
          path: accessor.uri(operation),
          severity: 'error',
          type: 'other',
        }),
      )
    const extra = params
      .filter((param) => !pathSegments.some((segment) => segment.name === param.name))
      .map(
        (param): Issue => ({
          message: `parameter "${param.name}" is not defined in "${urlTemplate}"`,
          path: accessor.uri(operation),
          severity: 'error',
          type: 'other',
        }),
      )
    return [...missing, ...extra]
  })
}
