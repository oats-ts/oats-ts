import { OpenAPIObject } from '@oats-ts/openapi-model'
import { failure, success, Try } from '@oats-ts/try'
import { IssueTypes } from '@oats-ts/validators'
import YAML from 'yamljs'

export function yamlParse(uri: string, input: string): Promise<Try<OpenAPIObject>> {
  try {
    return Promise.resolve(success(YAML.parse(input)))
  } catch (error) {
    return Promise.resolve(
      failure([
        {
          path: uri,
          message: `failed to parse as YAML (${error})`,
          severity: 'error',
          type: IssueTypes.other,
        },
      ]),
    )
  }
}
