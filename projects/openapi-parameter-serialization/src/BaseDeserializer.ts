import { MimeTypeParameterRule, ValueParameterRule } from '@oats-ts/rules'
import { Failure, failure, fluent, FluentTry, fromArray, success, Try } from '@oats-ts/try'
import { Base } from './Base'
import { DefaultValueDeserializer } from './DefaultValueDeserializer'
import { Primitive, PrimitiveRecord, PrimitiveArray, ValueDeserializer } from './types'
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
    properties: Record<string, ValueParameterRule>,
    record: Record<string, string | undefined>,
    path: string,
  ): FluentTry<PrimitiveRecord> {
    const keys = Object.keys(properties)
    const recordKeys = Object.keys(record)
    const extraKeyIssues = recordKeys
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
    return fluent(
      mapRecord(
        keys,
        (key): Try<Primitive> => {
          const valueDescriptor = properties[key]
          const value = record[key]
          return this.values.deserialize(
            valueDescriptor,
            isNil(value) ? value : this.decode(value),
            this.append(path, key),
          )
        },
        (key) => this.decode(key),
      ),
    )
  }

  protected stringValuesToArray(items: ValueParameterRule, values: string[], path: string): FluentTry<PrimitiveArray> {
    return fluent(
      fromArray(values.map((value, i) => this.values.deserialize(items, this.decode(value), this.append(path, i)))),
    )
  }

  protected schemaDeserialize(rule: MimeTypeParameterRule, value: string | undefined, path: string): Try<any> {
    if (isNil(value)) {
      return success(value)
    }
    try {
      switch (rule.mimeType) {
        case 'application/json': {
          return success(JSON.parse(value))
        }
        default:
          return failure({
            message: `unknown mime-type "${rule.mimeType}" (needs custom deserializer)`,
            path,
            severity: 'error',
          })
      }
    } catch (e) {
      return failure({ message: `failed to deserialize using "${rule.mimeType}": ${e}`, path, severity: 'error' })
    }
  }
}
