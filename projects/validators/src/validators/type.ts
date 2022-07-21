import { typed } from '../typed'
import { Issue, Validator, ValidatorConfig } from '../typings'
import { isNil } from '../utils'

export type ValueType = 'array' | 'boolean' | 'nil' | 'number' | 'object' | 'string'

const Messages: Record<ValueType, string> = {
  array: 'should be an array',
  boolean: 'should be a boolean',
  nil: 'should be null or undefined',
  number: 'should be a number',
  object: 'should be an object',
  string: 'should be a string',
}

const TypeChecks: { [key in ValueType]: (input: any) => boolean } = {
  array: Array.isArray,
  boolean: (input: any) => typeof input === 'boolean',
  nil: (input: any) => input === null || input === undefined,
  number: (input: any) => typeof input === 'number',
  object: (input: any) => typeof input === 'object' && input !== null,
  string: (input: any) => typeof input === 'string',
}

const type =
  <I, T extends ValueType>(type: T) =>
  (validate?: Validator<I>) =>
    typed((input: any, path: string, config: ValidatorConfig): Issue[] => {
      const severity = config.severity(type)!
      if (!TypeChecks[type](input)) {
        return [
          {
            path,
            message: Messages[type],
            severity,
          },
        ]
      }
      if (isNil(validate)) {
        return []
      }
      return validate(input, path, config)
    }, type)

export const string = type<string, 'string'>('string')
export const number = type<number, 'number'>('number')
export const boolean = type<boolean, 'boolean'>('boolean')
export const nil = type<null | undefined, 'nil'>('nil')
export const array = type<any[], 'array'>('array')
export const object = type<object, 'object'>('object')
