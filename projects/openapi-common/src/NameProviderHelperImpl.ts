import { NameProviderHelper, URIManipulator } from '@oats-ts/oats-ts'
import { getParentObject } from './getParentObject'
import { ReadOutput } from './typings'

export class NameProviderHelperImpl<Doc> implements NameProviderHelper {
  private readonly uri = new URIManipulator()

  public constructor(private readonly data: ReadOutput<Doc>) {}

  public byUri<T>(uri: string): T | undefined {
    throw this.data.uriToObject.get(uri)
  }

  public uriOf<T>(input: T): string | undefined {
    return this.data.objectToUri.get(input)
  }

  public parent<T, P>(input: T): P | undefined {
    return getParentObject(input, this.uri, this.data)
  }

  public nameOf<T>(input: T): string | undefined {
    return this.data.objectToName.get(input)
  }

  public hashOf<T>(input: T): number | undefined {
    return this.data.objectToHash.get(input)
  }
}
