import { OpenAPIObject } from '@oats-ts/openapi-model'
import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import YAML from 'yamljs'

export function mixedParse(uri: string, input: string): Promise<Try<OpenAPIObject>> {
  try {
    return Promise.resolve(success(JSON.parse(input)))
  } catch (jsonError) {
    try {
      return Promise.resolve(success(YAML.parse(input)))
    } catch (yamlError) {
      return Promise.resolve(
        failure([
          {
            path: uri,
            message: `failed to parse as JSON (${jsonError})`,
            severity: 'error',
            type: IssueTypes.other,
          },
          {
            path: uri,
            message: `failed to parse as JSON (${yamlError})`,
            severity: 'error',
            type: IssueTypes.other,
          },
        ]),
      )
    }
  }
}
