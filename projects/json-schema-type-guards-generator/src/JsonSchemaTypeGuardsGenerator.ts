import { isNil, sortBy } from 'lodash'
import { getNamedSchemas, ReadOutput, createGeneratorContext, HasSchemas } from '@oats-ts/model-common'
import { BaseCodeGenerator } from '@oats-ts/generator'
import { TypeGuardGeneratorConfig } from './typings'
import { ImportDeclaration, factory, SourceFile } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { JsonSchemaGeneratorContext, JsonSchemaGeneratorTarget } from '@oats-ts/json-schema-common'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { success, Try } from '@oats-ts/try'
import { getTypeGuardImports } from './getTypeGuardImports'
import { getTypeGuardFunctionAst } from './getTypeGuardFunctionAst'
import { getTypeAssertionAst } from './getTypeAssertionAst'

export class JsonSchemaTypeGuardsGenerator<T extends ReadOutput<HasSchemas>> extends BaseCodeGenerator<
  T,
  SourceFile,
  Referenceable<SchemaObject>,
  JsonSchemaGeneratorContext
> {
  constructor(private readonly config: TypeGuardGeneratorConfig) {
    super()
  }

  public name(): JsonSchemaGeneratorTarget {
    return 'json-schema/type-guard'
  }

  public consumes(): JsonSchemaGeneratorTarget[] {
    return ['json-schema/type']
  }

  public runtimeDependencies(): string[] {
    return []
  }

  protected createContext(): JsonSchemaGeneratorContext {
    return createGeneratorContext(this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): Referenceable<SchemaObject>[] {
    return sortBy(getNamedSchemas(this.context), (schema) => this.context.nameOf(schema, this.name())).filter(
      (schema) => !this.config.ignore(schema, this.context.uriOf(schema)),
    )
  }

  public referenceOf(input: any) {
    return isNil(this.context.nameOf(input))
      ? undefined
      : factory.createIdentifier(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>): ImportDeclaration[] {
    const { context } = this
    return getModelImports(fromPath, this.id, [input], context)
  }

  public async generateItem(schema: Referenceable<SchemaObject>): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(schema, 'json-schema/type-guard')
    const typeImports = this.context.dependenciesOf(path, schema, 'json-schema/type')
    return success(
      createSourceFile(
        path,
        [...typeImports, ...getTypeGuardImports(schema, this.context, this.config)],
        [
          getTypeGuardFunctionAst(
            schema,
            this.context,
            getTypeAssertionAst(schema, this.context, factory.createIdentifier('input'), this.config, 0),
          ),
        ],
      ),
    )
  }
}
