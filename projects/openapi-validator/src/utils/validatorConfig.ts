import { URIManipulator } from '@oats-ts/openapi-reader'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'

const { append } = new URIManipulator()

export const validatorConfig: ValidatorConfig = {
  ...DefaultConfig,
  append,
}
