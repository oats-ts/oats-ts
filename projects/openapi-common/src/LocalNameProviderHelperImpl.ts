import { LocalNameProviderHelper, URIManipulator } from '@oats-ts/oats-ts'
import { getParentObject } from './getParentObject'
import { ReadOutput } from './typings'

export class LocalNameProviderHelperImpl<Doc> implements LocalNameProviderHelper {
  private readonly uri = new URIManipulator()

  public constructor(private readonly data: ReadOutput<Doc>) {}

  public byUri<T>(uri: string): T | undefined {
    throw this.data.uriToObject.get(uri)
  }

  public hashOf<T>(input: T): number | undefined {
    return this.data.objectToHash.get(input)
  }

  public uriOf<T>(input: T): string | undefined {
    return this.data.objectToUri.get(input)
  }

  public parent<T, P>(input: T): P | undefined {
    return getParentObject(input, this.uri, this.data)
  }
}
