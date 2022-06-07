import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { JsonSchemaGeneratorContext, JsonSchemaGeneratorTarget } from '@oats-ts/json-schema-common'
import { TypeNode, ImportDeclaration, SourceFile } from 'typescript'
import { sortBy } from 'lodash'
import { GeneratorConfig, BaseCodeGenerator } from '@oats-ts/generator'
import { createGeneratorContext, getNamedSchemas, HasSchemas, ReadOutput } from '@oats-ts/model-common'
import { TypesGeneratorConfig } from './typings'
import { generateType } from './generateType'
import { getTypeImports } from './getTypeImports'
import { getExternalTypeReferenceAst } from './getExternalTypeReferenceAst'

export class JsonSchemaTypesGenerator<T extends ReadOutput<HasSchemas>> extends BaseCodeGenerator<
  T,
  SourceFile,
  Referenceable<SchemaObject>,
  JsonSchemaGeneratorContext
> {
  public name(): JsonSchemaGeneratorTarget {
    return 'json-schema/type'
  }

  public consumes(): string[] {
    return []
  }

  protected createContext(): JsonSchemaGeneratorContext {
    return createGeneratorContext(this.input, this.config, this.dependencies)
  }

  protected getItems(): Referenceable<SchemaObject>[] {
    return sortBy(getNamedSchemas(this.context), (schema) => this.context.nameOf(schema))
  }

  public referenceOf(input: Referenceable<SchemaObject>): TypeNode {
    const { context, config } = this
    return getExternalTypeReferenceAst(input, context, config)
  }

  public dependenciesOf<Model = any, Dep = any>(fromPath: string, input: Model): Dep[] {
    throw new Error('Method not implemented.')
  }

  public runtimeDependencies(): string[] {
    throw new Error('Method not implemented.')
  }

  // public initialize(data: T, config: GeneratorConfig, generators: CodeGenerator<T, TypeScriptModule>[]): void {
  //   this.context =
  // }

  // public async generate(): Promise<Result<TypeScriptModule[]>> {
  //   const { context, config } = this
  //   const { nameOf } = context
  //   const schemas = sortBy(getNamedSchemas(context), (schema) => nameOf(schema))
  //   const data = mergeTypeScriptModules(
  //     schemas.map((schema): TypeScriptModule => generateType(schema, context, config)),
  //   )
  //   return {
  //     isOk: true,
  //     data,
  //     issues: [],
  //   }
  // }

  // public referenceOf(input: Referenceable<SchemaObject>): TypeNode {
  //   const { context, config } = this
  //   return getExternalTypeReferenceAst(input, context, config)
  // }

  // public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>): ImportDeclaration[] {
  //   const { context } = this
  //   return getTypeImports(fromPath, input, context, true)
  // }
}
