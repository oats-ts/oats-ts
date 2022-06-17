import { Try, failure, success } from '@oats-ts/try'
import { IssueTypes, ValidatorConfig } from '@oats-ts/validators'
import { Primitive, ValueParser } from '../types'

export const literalParser =
  <T extends Primitive, L extends T>(literal: L): ValueParser<T, L> =>
  (value: T, name: string, path: string, config: ValidatorConfig): Try<L> => {
    if (value !== literal) {
      const strLiteral = typeof literal === 'string' ? `"${literal}"` : literal
      return failure([
        {
          message: `should be ${strLiteral}.`,
          path,
          severity: 'error',
          type: IssueTypes.value,
        },
      ])
    }
    return success(value as L)
  }
