import { Base } from './Base'
import { DefaultValueDeserializer } from './DefaultValueDeserializer'
import { ValueDeserializer } from './types'

export abstract class BaseDeserializer extends Base {
  protected readonly values: ValueDeserializer

  constructor() {
    super()
    this.values = this.createValueDeserializer()
  }

  protected createValueDeserializer(): ValueDeserializer {
    return new DefaultValueDeserializer()
  }
}
