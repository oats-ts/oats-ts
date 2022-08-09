import { NameProvider, NameProviderHelper, PathProviderHelper, URIManipulator } from '@oats-ts/oats-ts'
import { getParentObject } from './getParentObject'
import { ReadOutput } from './types'

export class PathProviderHelperImpl<Doc> implements PathProviderHelper {
  private readonly uri = new URIManipulator()

  constructor(
    private readonly data: ReadOutput<Doc>,
    private readonly nameProvider: NameProvider,
    private readonly nameProviderHelper: NameProviderHelper,
  ) {}

  uriOf<T>(input: T): string | undefined {
    return this.data.objectToUri.get(input)
  }

  parent<T, P>(input: T): P | undefined {
    return getParentObject(input, this.uri, this.data)
  }

  nameOf<T>(input: T, target: string): string {
    return this.nameProvider(input, target, this.nameProviderHelper)
  }
}
