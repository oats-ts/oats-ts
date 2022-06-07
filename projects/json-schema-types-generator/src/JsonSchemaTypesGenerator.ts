import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { JsonSchemaGeneratorContext, JsonSchemaGeneratorTarget } from '@oats-ts/json-schema-common'
import { TypeNode, ImportDeclaration, SourceFile } from 'typescript'
import { sortBy } from 'lodash'
import { BaseCodeGenerator } from '@oats-ts/generator'
import { createGeneratorContext, getNamedSchemas, HasSchemas, ReadOutput } from '@oats-ts/model-common'
import { TypesGeneratorConfig } from './typings'
import { getTypeImports } from './getTypeImports'
import { getExternalTypeReferenceAst } from './getExternalTypeReferenceAst'
import { success, Try } from '@oats-ts/try'
import { createSourceFile } from '@oats-ts/typescript-common'
import { getNamedTypeAst } from './getNamedTypeAst'

export class JsonSchemaTypesGenerator<T extends ReadOutput<HasSchemas>> extends BaseCodeGenerator<
  T,
  SourceFile,
  Referenceable<SchemaObject>,
  JsonSchemaGeneratorContext
> {
  constructor(private readonly config: TypesGeneratorConfig) {
    super()
  }

  public name(): JsonSchemaGeneratorTarget {
    return 'json-schema/type'
  }

  public consumes(): string[] {
    return []
  }

  public runtimeDependencies(): string[] {
    return []
  }

  protected createContext(): JsonSchemaGeneratorContext {
    return createGeneratorContext(this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): Referenceable<SchemaObject>[] {
    return sortBy(getNamedSchemas(this.context), (schema) => this.context.nameOf(schema))
  }

  public referenceOf(input: Referenceable<SchemaObject>): TypeNode {
    return getExternalTypeReferenceAst(input, this.context, this.config)
  }

  public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>): ImportDeclaration[] {
    return getTypeImports(fromPath, input, this.context, true)
  }

  public async generateItem(schema: Referenceable<SchemaObject>): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(schema, 'json-schema/type')
    return success(
      createSourceFile(path, getTypeImports(path, schema, this.context, false), [
        getNamedTypeAst(schema, this.context, this.config),
      ]),
    )
  }
}
