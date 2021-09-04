import { TestChannel } from '../channels/TestChannel'
import { Api } from './Api'

export class ApiStub implements Api {
  protected fallback(): never {
    throw new Error('Not implemented.')
  }
  public testChannel(): TestChannel {
    return this.fallback()
  }
}
