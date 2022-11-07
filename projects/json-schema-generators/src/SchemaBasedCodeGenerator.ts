import { sortBy } from 'lodash'
import { BaseCodeGenerator, GeneratorInit } from '@oats-ts/oats-ts'
import { SourceFile } from 'typescript'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { createGeneratorContext, getNamedSchemas, HasSchemas, ReadOutput } from '@oats-ts/model-common'
import { JsonSchemaGeneratorContext, JsonSchemaGeneratorTarget, TraversalHelper, TypeDiscriminator } from './types'
import { TraversalHelperImpl } from './TraversalHelperImpl'
import { TypeDiscriminatorImpl } from './TypeDiscriminatorImpl'

export abstract class SchemaBasedCodeGenerator<T extends ReadOutput<HasSchemas>, Cfg> extends BaseCodeGenerator<
  T,
  SourceFile,
  Cfg,
  Referenceable<SchemaObject>,
  JsonSchemaGeneratorContext
> {
  protected helper!: TraversalHelper
  protected type!: TypeDiscriminator

  public abstract name(): JsonSchemaGeneratorTarget
  public abstract consumes(): JsonSchemaGeneratorTarget[]

  public initialize(init: GeneratorInit<T, SourceFile>): void {
    super.initialize(init)
    this.type = new TypeDiscriminatorImpl()
    this.helper = new TraversalHelperImpl(this.context())
  }

  protected createContext(): JsonSchemaGeneratorContext {
    return createGeneratorContext(this, this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): Referenceable<SchemaObject>[] {
    return sortBy(getNamedSchemas(this.context()), (schema) => this.context().nameOf(schema, this.name()))
  }
}
