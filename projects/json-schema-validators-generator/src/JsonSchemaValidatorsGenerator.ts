import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { sortBy, isNil } from 'lodash'
import { getNamedSchemas, ReadOutput, HasSchemas, createGeneratorContext } from '@oats-ts/model-common'
import { generateValidator } from './generateValidator'
import { ValidatorsGeneratorConfig, ValidatorsGeneratorContext } from './typings'
import { Result, GeneratorConfig, CodeGenerator } from '@oats-ts/generator'
import { Expression, ImportDeclaration, factory } from 'typescript'
import { SchemaObject, ReferenceObject } from '@oats-ts/json-schema-model'
import { collectExternalReferenceImports, getValidatorImports } from './getValidatorImports'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'

export abstract class JsonSchemaValidatorsGenerator<T extends ReadOutput<HasSchemas>>
  implements CodeGenerator<T, TypeScriptModule>
{
  private context: ValidatorsGeneratorContext = null
  private config: GeneratorConfig & ValidatorsGeneratorConfig

  public abstract readonly id: string
  public abstract readonly produces: [string]
  public abstract readonly consumes: [string]

  public constructor(config: GeneratorConfig & ValidatorsGeneratorConfig) {
    this.config = config
  }

  public initialize(data: T, generators: CodeGenerator<T, TypeScriptModule>[]): void {
    this.context = {
      ...createGeneratorContext(data, this.config, generators),
      produces: this.produces[0],
      consumes: this.consumes[0],
    }
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
    const { nameOf } = context
    const schemas = sortBy(getNamedSchemas(context), (schema) => nameOf(schema, context.produces))
    const data = mergeTypeScriptModules(
      schemas.map((schema): TypeScriptModule => generateValidator(schema, context, config)),
    )
    return {
      data,
      isOk: true,
      issues: [],
    }
  }

  public referenceOf(input: SchemaObject | ReferenceObject, target: string): Expression {
    const { context, config } = this
    const { nameOf, dereference } = context
    switch (target) {
      case context.produces:
        const schema = dereference(input)
        const name = nameOf(schema, context.produces)
        return isNil(name) ? getRightHandSideValidatorAst(input, context, config, 0) : factory.createIdentifier(name)
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: SchemaObject | ReferenceObject, target: string): ImportDeclaration[] {
    const { context, config } = this
    switch (target) {
      case context.produces:
        return getValidatorImports(fromPath, input, context, config, collectExternalReferenceImports)
      default:
        return []
    }
  }
}
