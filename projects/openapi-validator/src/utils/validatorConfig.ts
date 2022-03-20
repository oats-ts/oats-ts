import { DefaultURIManipulator } from '@oats-ts/openapi-reader'
import { DefaultConfig, ValidatorConfig } from '@oats-ts/validators'

const { append } = new DefaultURIManipulator()

export const validatorConfig: ValidatorConfig = {
  ...DefaultConfig,
  append,
}
