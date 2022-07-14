import { OpenAPIObject } from '@oats-ts/openapi-model'
import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'

export function jsonParse(uri: string, input: string): Promise<Try<OpenAPIObject>> {
  try {
    return Promise.resolve(success(JSON.parse(input)))
  } catch (error) {
    return Promise.resolve(
      failure([
        {
          path: uri,
          message: `failed to parse as JSON (${error})`,
          severity: 'error',
          type: IssueTypes.other,
        },
      ]),
    )
  }
}
