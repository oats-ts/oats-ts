import { any } from './any'
import { Issue, IssueType, Severity, Validator, ValidatorConfig } from '../typings'
import { getSeverity, isNil } from '../utils'

export enum ValueType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  NIL = 'nil',
  OBJECT = 'object',
  ARRAY = 'array',
}

const TypeChecks = {
  [ValueType.ARRAY]: Array.isArray,
  [ValueType.BOOLEAN]: (input: any) => typeof input === 'boolean',
  [ValueType.NIL]: (input: any) => input === null || input === undefined,
  [ValueType.NUMBER]: (input: any) => typeof input === 'number',
  [ValueType.OBJECT]: (input: any) => typeof input === 'object' && input !== null,
  [ValueType.STRING]: (input: any) => typeof input === 'string',
}

export const type =
  <T>(...types: ValueType[]) =>
  (validate: Validator<T> = any): Validator<any> =>
  (input: any, config: ValidatorConfig) => {
    const severity = getSeverity(IssueType.TYPE, config)
    if (!isNil(severity) && !types.some((type) => TypeChecks[type](input))) {
      return [
        {
          type: IssueType.TYPE,
          message: types.length === 1 ? `should be a(n) ${types[0]}` : `should be one of [${types.join(', ')}]`,
          path: config.path,
          severity,
        },
      ]
    }
    return validate(input, config)
  }

export const string = type<string>(ValueType.STRING)
export const number = type<number>(ValueType.NUMBER)
export const boolean = type<boolean>(ValueType.BOOLEAN)
export const nil = type<null | undefined>(ValueType.NIL)
export const array = type<any[]>(ValueType.ARRAY)
export const object = type<object>(ValueType.OBJECT)
export const primitive = type<string | number | boolean>(ValueType.STRING, ValueType.NUMBER, ValueType.BOOLEAN)
