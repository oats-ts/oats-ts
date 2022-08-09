import { NameProviderHelper, URIManipulator } from '@oats-ts/oats-ts'
import { getParentObject } from './getParentObject'
import { ReadOutput } from './types'

export class NameProviderHelperImpl<Doc> implements NameProviderHelper {
  private readonly uri = new URIManipulator()

  constructor(private data: ReadOutput<Doc>) {}

  uriOf<T>(input: T): string | undefined {
    return this.data.objectToUri.get(input)
  }

  parent<T, P>(input: T): P | undefined {
    return getParentObject(input, this.uri, this.data)
  }

  nameOf<T>(input: T): string | undefined {
    return this.data.objectToName.get(input)
  }
}
