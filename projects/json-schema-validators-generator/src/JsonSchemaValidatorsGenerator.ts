import { sortBy, isNil } from 'lodash'
import { getNamedSchemas, ReadOutput, HasSchemas, createGeneratorContext, RuntimePackages } from '@oats-ts/model-common'
import { ValidatorsGeneratorConfig } from './typings'
import { BaseCodeGenerator } from '@oats-ts/generator'
import { Expression, ImportDeclaration, factory, SourceFile } from 'typescript'
import { SchemaObject, Referenceable } from '@oats-ts/json-schema-model'
import { collectExternalReferenceImports, getValidatorImports } from './getValidatorImports'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { JsonSchemaGeneratorTarget, JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common'
import { success, Try } from '@oats-ts/try'
import { createSourceFile } from '@oats-ts/typescript-common'
import { getValidatorAst } from './getValidatorAst'

export class JsonSchemaValidatorsGenerator<T extends ReadOutput<HasSchemas>> extends BaseCodeGenerator<
  T,
  SourceFile,
  Referenceable<SchemaObject>,
  JsonSchemaGeneratorContext
> {
  constructor(private readonly config: ValidatorsGeneratorConfig) {
    super()
  }

  public name(): JsonSchemaGeneratorTarget {
    return 'json-schema/type-validator'
  }

  public consumes(): string[] {
    return ['json-schema/type']
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.Validators.name]
  }

  protected createContext(): JsonSchemaGeneratorContext {
    return createGeneratorContext(this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): Referenceable<SchemaObject>[] {
    return sortBy(getNamedSchemas(this.context), (schema) => this.context.nameOf(schema, 'json-schema/type-validator'))
  }

  public referenceOf(input: Referenceable<SchemaObject>): Expression {
    const schema = this.context.dereference(input)
    const name = this.context.nameOf(schema, 'json-schema/type-validator')
    return isNil(name)
      ? getRightHandSideValidatorAst(input, this.context, this.config, 0)
      : factory.createIdentifier(name)
  }

  public dependenciesOf(fromPath: string, input: Referenceable<SchemaObject>): ImportDeclaration[] {
    return getValidatorImports(fromPath, input, this.context, this.config, collectExternalReferenceImports)
  }

  public async generateItem(schema: Referenceable<SchemaObject>): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(schema, 'json-schema/type-validator')
    return success(
      createSourceFile(path, getValidatorImports(path, schema, this.context, this.config), [
        getValidatorAst(schema, this.context, this.config),
      ]),
    )
  }
}
