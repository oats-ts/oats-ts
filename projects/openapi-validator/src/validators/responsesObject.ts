import { ResponsesObject } from 'openapi3-ts'
import { Issue, object, record, string } from '@oats-ts/validators'
import { append } from '../utils/append'
import { entries, flatMap } from 'lodash'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'

const validator = object(record(string(), object()))

export function responsesObject(
  data: ResponsesObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() => {
    const { uriOf, dereference } = context
    return ordered(() => validator(data, { append, path: uriOf(data) }))(() =>
      flatMap(entries(data), ([statusCode, response]): Issue[] => {
        const issues: Issue[] = []
        if (
          statusCode !== 'default' &&
          !Number.isNaN(parseInt(statusCode)) &&
          parseInt(statusCode).toString() !== statusCode
        ) {
          issues.push({
            message: `should be "default" or integer`,
            path: uriOf(response),
            severity: 'error',
            type: 'other',
          })
        }
        issues.push(...config.responseObject(dereference(response), context, config))
        return issues
      }),
    )
  })
}
