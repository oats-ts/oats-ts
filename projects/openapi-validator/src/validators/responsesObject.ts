import { ResponsesObject } from '@oats-ts/openapi-model'
import { Issue } from '@oats-ts/validators'
import { validatorConfig } from '../utils/validatorConfig'
import { entries, flatMap } from 'lodash'
import { ordered } from '../utils/ordered'
import { OpenAPIValidatorConfig, OpenAPIValidatorContext } from '../typings'
import { ifNotValidated } from '../utils/ifNotValidated'
import { referenceable } from './referenceable'
import { structural } from '../structural'

export function responsesObject(
  data: ResponsesObject,
  context: OpenAPIValidatorContext,
  config: OpenAPIValidatorConfig,
): Issue[] {
  return ifNotValidated(
    context,
    data,
  )(() =>
    ordered(() => structural.responsesObject(data, context.uriOf(data), validatorConfig))(() =>
      flatMap(entries(data), ([statusCode, response]): Issue[] => {
        const issues: Issue[] = []
        if (
          statusCode !== 'default' &&
          !Number.isNaN(parseInt(statusCode)) &&
          parseInt(statusCode).toString() !== statusCode
        ) {
          issues.push({
            message: `should be "default" or integer`,
            path: context.uriOf(response),
            severity: 'error',
          })
        }
        issues.push(...referenceable(config.responseObject)(response!, context, config))
        return issues
      }),
    ),
  )
}
