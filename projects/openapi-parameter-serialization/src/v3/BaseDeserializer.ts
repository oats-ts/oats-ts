import { Failure, failure, fluent, FluentTry, fromArray, Try } from '@oats-ts/try'
import { Base } from './Base'
import { DefaultValueDeserializer } from './DefaultValueDeserializer'
import { Primitive, PrimitiveRecord, ValueDeserializer, ValueDsl } from './types'
import { mapRecord, isNil } from './utils'

export abstract class BaseDeserializer extends Base {
  protected readonly values: ValueDeserializer

  constructor() {
    super()
    this.values = this.createValueDeserializer()
  }

  protected createValueDeserializer(): ValueDeserializer {
    return new DefaultValueDeserializer()
  }

  protected keyValuePairsToObject(
    properties: Record<string, ValueDsl>,
    record: Record<string, string | undefined>,
    path: string,
    allowExtraKeys: boolean = true,
  ): FluentTry<PrimitiveRecord> {
    const keys = Object.keys(properties)
    if (!allowExtraKeys) {
      const extraKeyIssues = keys
        .filter((key) => isNil(properties[key]))
        .map(([key]) =>
          failure({
            message: `should not have "${key}"`,
            path,
            severity: 'error',
          }),
        )
      if (extraKeyIssues.length > 0) {
        return fluent(fromArray(extraKeyIssues) as Failure)
      }
    }
    return fluent(
      mapRecord(
        keys,
        (key): Try<Primitive> => {
          const valueDsl = properties[key]
          const value = record[key]
          return this.values.deserialize(valueDsl, isNil(value) ? value : this.decode(value), this.append(path, key))
        },
        (key) => this.decode(key),
      ),
    )
  }

  protected stringValuesToArray<T>(items: ValueDsl, value: string[], path: string): FluentTry<string[]> {
    throw new TypeError('not implemented')
  }
}
