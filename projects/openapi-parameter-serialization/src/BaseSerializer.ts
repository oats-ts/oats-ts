import { failure, fluent, FluentTry, fromArray, fromRecord, success, Try } from '@oats-ts/try'
import { Base } from './Base'
import { DefaultValueSerializer } from './DefaultValueSerializer'
import { Location, PrimitiveArray, PrimitiveRecord, SchemaDescriptor, ValueDescriptor, ValueSerializer } from './types'
import { entries, isNil } from './utils'

export abstract class BaseSerializer extends Base {
  protected readonly values: ValueSerializer

  constructor() {
    super()
    this.values = this.createValueSerializer()
  }

  protected createValueSerializer(): ValueSerializer {
    return new DefaultValueSerializer()
  }

  protected objectToKeyValuePairs(
    properties: Record<string, ValueDescriptor>,
    value: Exclude<PrimitiveRecord, undefined>,
    path: string,
  ): FluentTry<[string, string][]> {
    return fluent(
      fromRecord(
        entries(properties)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .reduce((pairs, [key, valueDescriptor]) => {
            pairs[key] = this.values.serialize(valueDescriptor, value?.[key], this.append(path, key))
            return pairs
          }, {} as Record<string, Try<string | undefined>>),
      ),
    ).map((pairs) => entries(pairs).filter((input): input is [string, string] => !isNil(input[1])))
  }

  protected arrayToValues(
    items: ValueDescriptor,
    value: Exclude<PrimitiveArray, undefined>,
    path: string,
  ): FluentTry<string[]> {
    return fluent(
      fromArray(value.map((item, index) => this.values.serialize(items, item, this.append(path, index)))),
    ).map((items) => items.filter((item): item is string => !isNil(item)))
  }

  protected schemaSerialize(descriptor: SchemaDescriptor<Location>, value: any, path: string): Try<string | undefined> {
    if (isNil(value)) {
      return success(undefined)
    }
    try {
      switch (descriptor.mimeType) {
        case 'application/json': {
          return success(JSON.stringify(value))
        }
        default:
          return failure({
            message: `unknown mime-type "${descriptor.mimeType}" (needs custom serializer)`,
            path,
            severity: 'error',
          })
      }
    } catch (e) {
      return failure({ message: `failed to serialize using "${descriptor.mimeType}": ${e}`, path, severity: 'error' })
    }
  }
}
