import { Base } from './Base'
import { DefaultValueSerializer } from './DefaultValueSerializer'
import { ValueSerializer } from './types'

export abstract class BaseSerializer extends Base {
  protected readonly values: ValueSerializer

  constructor() {
    super()
    this.values = this.createValueSerializer()
  }

  protected createValueSerializer(): ValueSerializer {
    return new DefaultValueSerializer()
  }
}
