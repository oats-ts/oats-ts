import { URIManipulator } from '@oats-ts/oats-ts'
import { isNil } from 'lodash'
import { JsonSchemaGeneratorContext, JsonSchemaGeneratorTarget, TraversalHelper } from './types'

export class TraversalHelperImpl implements TraversalHelper {
  private readonly uri = new URIManipulator()

  public constructor(private readonly context: JsonSchemaGeneratorContext) {}

  public uriOf<T>(input: T): string | undefined {
    return this.context.uriOf(input)
  }

  public parent<T, P>(input: T): P | undefined {
    const uri = this.context.uriOf(input)
    if (isNil(uri)) {
      return undefined
    }
    const fragments = this.uri.fragments(uri)
    if (fragments.length === 0) {
      return undefined
    }
    const parentUri = this.uri.setFragments(uri, fragments.slice(0, -1))
    return this.context.byUri(parentUri)
  }

  public nameOf<T>(input: T, target: string): string {
    return this.context.nameOf(input, target as JsonSchemaGeneratorTarget)
  }
}
