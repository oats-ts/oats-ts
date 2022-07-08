import { Try, success } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'
import { Primitive, ValueDeserializer } from '../../types'
import { isNil } from '../../utils'

export const optionalParser =
  <I extends Primitive, O extends Primitive>(parser: ValueDeserializer<I, O>): ValueDeserializer<I, O | undefined> =>
  (value: I | undefined, name: string, path: string, config: ValidatorConfig): Try<O | undefined> => {
    return isNil(value) ? success(undefined) : parser(value, name, path, config)
  }
