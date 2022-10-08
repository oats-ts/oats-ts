import { URIManipulator } from '@oats-ts/oats-ts'
import { getParentObject } from './getParentObject'
import { JsonSchemaGeneratorContext, JsonSchemaGeneratorTarget, TraversalHelper } from './types'

export class TraversalHelperImpl implements TraversalHelper {
  private readonly uri = new URIManipulator()

  public constructor(private readonly context: JsonSchemaGeneratorContext) {}

  public uriOf<T>(input: T): string | undefined {
    return this.context.uriOf(input)
  }

  public parent<T, P>(input: T): P | undefined {
    return getParentObject(input, this.uri, this.context)
  }

  public nameOf<T>(input: T, target: string): string {
    return this.context.nameOf(input, target as JsonSchemaGeneratorTarget)
  }
}
