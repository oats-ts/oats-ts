import { any } from './any'
import { Issue, IssueType, Severity, Validator, ValidatorConfig } from '../typings'
import { getConfig, getSeverity, isNil } from '../utils'

export type ValueType = 'array' | 'boolean' | 'nil' | 'number' | 'object' | 'string'

const TypeChecks: { [key in ValueType]: (input: any) => boolean } = {
  array: Array.isArray,
  boolean: (input: any) => typeof input === 'boolean',
  nil: (input: any) => input === null || input === undefined,
  number: (input: any) => typeof input === 'number',
  object: (input: any) => typeof input === 'object' && input !== null,
  string: (input: any) => typeof input === 'string',
}

const type =
  <T>(type: ValueType) =>
  (validate: Validator<T> = any): Validator<any> =>
  (input: any, config?: Partial<ValidatorConfig>): Issue[] => {
    const cfg = getConfig(config)
    const severity = getSeverity(type, cfg)
    if (isNil(severity)) {
      return []
    }
    if (!TypeChecks[type](input)) {
      return [
        {
          type,
          message: `should be a(n) ${type}`,
          path: cfg.path,
          severity,
        },
      ]
    }
    return validate(input, cfg)
  }

export const string = type<string>('string')
export const number = type<number>('number')
export const boolean = type<boolean>('boolean')
export const nil = type<null | undefined>('nil')
export const array = type<any[]>('array')
export const object = type<object>('object')
