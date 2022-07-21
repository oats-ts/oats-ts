import { OpenAPIObject } from '@oats-ts/openapi-model'
import { failure, success, Try } from '@oats-ts/try'
import YAML from 'yamljs'

export function mixedParse(uri: string, input: string): Promise<Try<OpenAPIObject>> {
  try {
    return Promise.resolve(success(JSON.parse(input)))
  } catch (jsonError) {
    try {
      return Promise.resolve(success(YAML.parse(input)))
    } catch (yamlError) {
      return Promise.resolve(
        failure(
          {
            path: uri,
            message: `failed to parse as JSON (${jsonError})`,
            severity: 'error',
          },
          {
            path: uri,
            message: `failed to parse as YAML (${yamlError})`,
            severity: 'error',
          },
        ),
      )
    }
  }
}
