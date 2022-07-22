import { URIManipulator } from '@oats-ts/openapi-reader'
import { DefaultConfig, ValidatorConfig, ValidatorType } from '@oats-ts/validators'

const { append } = new URIManipulator()

export const validatorConfig: ValidatorConfig = {
  ...DefaultConfig,
  append,
  severity: (type: ValidatorType) => {
    if (type === 'restrictKeys') {
      return 'info'
    }
    return 'error'
  },
  message: (type: ValidatorType, path: string, data?: any) => {
    if (type === 'restrictKeys') {
      return 'property will be ignored by oats'
    }
    return DefaultConfig.message(type, path, data)
  },
}
