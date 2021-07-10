import { ResponsesObject } from 'openapi3-ts'
import { Issue, object, record, string } from '@oats-ts/validators'
import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { append } from '../append'
import { entries, flatMap } from 'lodash'
import { validateResponse } from './validateResponse'
import { ordered } from '../ordered'

const validator = object(record(string(), object()))

export const validateResponses = (data: ResponsesObject, context: OpenAPIGeneratorContext): Issue[] => {
  const { accessor } = context

  return ordered(() =>
    validator(data, {
      append,
      path: accessor.uri(data),
    }),
  )(() =>
    flatMap(entries(data), ([statusCode, response]): Issue[] => {
      const issues: Issue[] = []
      if (
        statusCode !== 'default' &&
        !Number.isNaN(parseInt(statusCode)) &&
        parseInt(statusCode).toString() !== statusCode
      ) {
        issues.push({
          message: `should be "default" or integer`,
          path: accessor.uri(response),
          severity: 'error',
          type: 'other',
        })
      }
      issues.push(...validateResponse(response, context))
      return issues
    }),
  )
}
