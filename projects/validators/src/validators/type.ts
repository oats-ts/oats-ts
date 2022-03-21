import { IssueTypes } from '../issueTypes'
import { Issue, Validator, ValidatorConfig } from '../typings'
import { isNil } from '../utils'

export type ValueType = 'array' | 'boolean' | 'nil' | 'number' | 'object' | 'string'

const ValueTypeToIssueType: Record<ValueType, string> = {
  array: IssueTypes.type,
  boolean: IssueTypes.type,
  nil: IssueTypes.value,
  number: IssueTypes.type,
  object: IssueTypes.type,
  string: IssueTypes.type,
}

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
  <T>(type: ValueType) =>
  (validate?: Validator<T>): Validator<any> =>
  (input: any, path: string, config: ValidatorConfig): Issue[] => {
    const issueType = ValueTypeToIssueType[type]
    const severity = isNil(config.severity) ? 'error' : config.severity(issueType)
    if (isNil(severity)) {
      return []
    }
    if (!TypeChecks[type](input)) {
      return [
        {
          type: issueType,
          message: Messages[type],
          path: path,
          severity,
        },
      ]
    }
    if (isNil(validate)) {
      return []
    }
    return validate(input, path, config)
  }

export const string = type<string>('string')
export const number = type<number>('number')
export const boolean = type<boolean>('boolean')
export const nil = type<null | undefined>('nil')
export const array = type<any[]>('array')
export const object = type<object>('object')
