import { Try, failure, success } from '@oats-ts/try'
import { IssueTypes, ValidatorConfig } from '@oats-ts/validators'
import { Primitive, ValueDeserializer } from '../../types'

export const literalParser =
  <T extends Primitive, L extends T>(literal: L): ValueDeserializer<T, L> =>
  (value: T | undefined, name: string, path: string, config: ValidatorConfig): Try<L> => {
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
