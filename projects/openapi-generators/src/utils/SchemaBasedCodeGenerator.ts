import { sortBy } from 'lodash'
import { GeneratorInit } from '@oats-ts/oats-ts'
import { SourceFile } from 'typescript'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { TraversalHelperImpl } from './TraversalHelperImpl'
import { TypeDiscriminatorImpl } from './TypeDiscriminatorImpl'
import { OpenAPICodeGeneratorImpl } from './OpenAPICodeGeneratorImpl'
import { TypeDiscriminator, TraversalHelper } from '../types'
import { getNamedSchemas, OpenAPIGeneratorTarget, OpenAPIReadOutput } from '@oats-ts/openapi-common'

export abstract class SchemaBasedCodeGenerator<Cfg> extends OpenAPICodeGeneratorImpl<Cfg, Referenceable<SchemaObject>> {
  protected helper!: TraversalHelper
  protected type!: TypeDiscriminator

  public abstract name(): OpenAPIGeneratorTarget
  public abstract consumes(): OpenAPIGeneratorTarget[]

  public initialize(init: GeneratorInit<OpenAPIReadOutput, SourceFile>): void {
    super.initialize(init)
    this.type = new TypeDiscriminatorImpl()
    this.helper = new TraversalHelperImpl(this.context())
  }

  protected getItems(): Referenceable<SchemaObject>[] {
    return sortBy(getNamedSchemas(this.context()), (schema) => this.context().nameOf(schema, this.name()))
  }
}
