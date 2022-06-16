import { sortBy } from 'lodash'
import { BaseCodeGenerator } from '@oats-ts/generator'
import { SourceFile } from 'typescript'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { JsonSchemaGeneratorContext, JsonSchemaGeneratorTarget } from '@oats-ts/json-schema-common'
import { createGeneratorContext, getNamedSchemas, HasSchemas, ReadOutput } from '@oats-ts/model-common'

export abstract class SchemaBasedCodeGenerator<T extends ReadOutput<HasSchemas>, Cfg> extends BaseCodeGenerator<
  T,
  SourceFile,
  Cfg,
  Referenceable<SchemaObject>,
  JsonSchemaGeneratorContext
> {
  public abstract name(): JsonSchemaGeneratorTarget
  public abstract consumes(): JsonSchemaGeneratorTarget[]

  protected itemFilter(_item: Referenceable<SchemaObject>): boolean {
    return true
  }

  protected createContext(): JsonSchemaGeneratorContext {
    return createGeneratorContext(this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): Referenceable<SchemaObject>[] {
    return sortBy(getNamedSchemas(this.context), (schema) => this.context.nameOf(schema, this.name())).filter((item) =>
      this.itemFilter(item),
    )
  }
}
