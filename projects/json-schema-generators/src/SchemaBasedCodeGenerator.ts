import { sortBy } from 'lodash'
import { BaseCodeGenerator } from '@oats-ts/oats-ts'
import { SourceFile } from 'typescript'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { createGeneratorContext, getNamedSchemas, HasSchemas, ReadOutput } from '@oats-ts/model-common'
import { JsonSchemaGeneratorContext, JsonSchemaGeneratorTarget } from './types'

export abstract class SchemaBasedCodeGenerator<T extends ReadOutput<HasSchemas>, Cfg> extends BaseCodeGenerator<
  T,
  SourceFile,
  Cfg,
  Referenceable<SchemaObject>,
  JsonSchemaGeneratorContext
> {
  public abstract name(): JsonSchemaGeneratorTarget
  public abstract consumes(): JsonSchemaGeneratorTarget[]

  protected createContext(): JsonSchemaGeneratorContext {
    return createGeneratorContext(this, this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): Referenceable<SchemaObject>[] {
    return sortBy(getNamedSchemas(this.context), (schema) => this.context.nameOf(schema, this.name()))
  }
}
