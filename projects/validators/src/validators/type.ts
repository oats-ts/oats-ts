import { Issue, ValueType, Validator, TypedValidatorConfig } from '../typings'
import { isNil } from '../utils'

const type =
  <T>(type: ValueType, typeMatches: (input: any) => input is T) =>
  (validate?: Validator<T>): Validator<any> =>
  (input: any, path: string, config: TypedValidatorConfig): Issue[] => {
    const severity = config.severity(type, path)
    if (isNil(severity)) {
      return []
    }
    if (!typeMatches(input)) {
      return [
        {
          path,
          message: config.message(type, path),
          severity,
        },
      ]
    }
    if (isNil(validate)) {
      return []
    }
    return validate(input, path, config)
  }

export const string = type<string>('string', (input: any): input is string => typeof input === 'string')
export const number = type<number>('number', (input: any): input is number => typeof input === 'number')
export const boolean = type<boolean>('boolean', (input: any): input is boolean => typeof input === 'boolean')
export const array = type<any[]>('array', Array.isArray)
export const nil = type<null | undefined>(
  'nil',
  (input: any): input is null | undefined => input === null || input === undefined,
)
export const object = type<object>(
  'object',
  (input: any): input is object => typeof input === 'object' && input !== null,
)
