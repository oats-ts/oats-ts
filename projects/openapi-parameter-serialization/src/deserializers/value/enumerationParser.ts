import { Try, failure, success } from '@oats-ts/try'
import { IssueTypes, ValidatorConfig } from '@oats-ts/validators'
import { Primitive, ValueDeserializer } from '../../types'

export const enumerationParser =
  <T extends Primitive, E extends T>(values: E[]): ValueDeserializer<T, E> =>
  (value: T | undefined, name: string, path: string, config: ValidatorConfig): Try<E> => {
    if (values.indexOf(value as E) < 0) {
      const valuesLiteral = values.map((v) => (typeof v === 'string' ? `"${v}"` : `${v}`)).join(',')
      return failure([
        {
          message: `should be one of ${valuesLiteral}.`,
          path,
          severity: 'error',
          type: IssueTypes.value,
        },
      ])
    }
    return success(value as E)
  }
