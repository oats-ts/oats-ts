import { URIManipulator } from '@oats-ts/oats-ts'
import { DefaultConfig, ValidatorConfig, ValidatorType } from '@oats-ts/validators'

const { append } = new URIManipulator()

export const validatorConfig: ValidatorConfig = {
  ...DefaultConfig,
  append,
  severity: (type: ValidatorType) => {
    if (type === 'restrictKey') {
      return 'info'
    }
    return 'error'
  },
  message: (type: ValidatorType, path: string, data?: any) => {
    if (type === 'restrictKey') {
      return 'unexpected key'
    }
    return DefaultConfig.message(type, path, data)
  },
}
