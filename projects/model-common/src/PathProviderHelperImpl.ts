import { NameProvider, NameProviderHelper, PathProviderHelper, URIManipulator } from '@oats-ts/oats-ts'
import { getParentObject } from './getParentObject'
import { ReadOutput } from './types'

export class PathProviderHelperImpl<Doc> implements PathProviderHelper {
  private readonly uri = new URIManipulator()

  public constructor(
    private readonly data: ReadOutput<Doc>,
    private readonly nameProvider: NameProvider,
    private readonly nameProviderHelper: NameProviderHelper,
  ) {}

  public uriOf<T>(input: T): string | undefined {
    return this.data.objectToUri.get(input)
  }

  public parent<T, P>(input: T): P | undefined {
    return getParentObject(input, this.uri, this.data)
  }

  public nameOf<T>(input: T, target: string): string {
    return this.nameProvider(input, target, this.nameProviderHelper)
  }
}
