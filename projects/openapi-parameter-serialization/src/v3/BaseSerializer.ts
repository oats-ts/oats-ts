import { fluent, FluentTry, fromArray, fromRecord, success, Try } from '@oats-ts/try'
import { Base } from './Base'
import { DefaultValueSerializer } from './DefaultValueSerializer'
import { PrimitiveArray, PrimitiveRecord, ValueDsl, ValueSerializer } from './types'
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
    properties: Record<string, ValueDsl>,
    value: Exclude<PrimitiveRecord, undefined>,
    path: string,
  ): FluentTry<[string, string][]> {
    return fluent(
      fromRecord(
        entries(properties)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .reduce((pairs, [key, valueDsl]) => {
            pairs[key] = this.values.serialize(valueDsl, value?.[key], this.append(path, key))
            return pairs
          }, {} as Record<string, Try<string | undefined>>),
      ),
    ).map((pairs) => entries(pairs).filter((input): input is [string, string] => !isNil(input[1])))
  }

  protected arrayToValues(
    items: ValueDsl,
    value: Exclude<PrimitiveArray, undefined>,
    path: string,
  ): FluentTry<string[]> {
    return fluent(
      fromArray(value.map((item, index) => this.values.serialize(items, item, this.append(path, index)))),
    ).map((items) => items.filter((item): item is string => !isNil(item)))
  }
}
