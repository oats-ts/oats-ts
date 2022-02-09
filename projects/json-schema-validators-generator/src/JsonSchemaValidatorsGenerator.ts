import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { sortBy, isNil } from 'lodash'
import {
  getNamedSchemas,
  ReadOutput,
  HasSchemas,
  createGeneratorContext,
  GeneratorContext,
} from '@oats-ts/model-common'
import { generateValidator } from './generateValidator'
import { ValidatorsGeneratorConfig } from './typings'
import { Result, GeneratorConfig, CodeGenerator } from '@oats-ts/generator'
import { Expression, ImportDeclaration, factory } from 'typescript'
import { SchemaObject, ReferenceObject } from '@oats-ts/json-schema-model'
import { collectExternalReferenceImports, getValidatorImports } from './getValidatorImports'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'
import { JsonSchemaGeneratorTarget } from '@oats-ts/json-schema-common'
import { JsonSchemaGeneratorContext } from '@oats-ts/json-schema-common/lib/types'

export class JsonSchemaValidatorsGenerator<T extends ReadOutput<HasSchemas>, Id extends string, C extends string>
  implements CodeGenerator<T, TypeScriptModule>
{
  private context: JsonSchemaGeneratorContext = null
  public readonly id: JsonSchemaGeneratorTarget = 'json-schema/type-validator'
  public readonly consumes: JsonSchemaGeneratorTarget[] = ['json-schema/type']

  public constructor(public readonly config: ValidatorsGeneratorConfig) {}

  public initialize(data: T, config: GeneratorConfig, generators: CodeGenerator<T, TypeScriptModule>[]): void {
    this.context = createGeneratorContext(data, config, generators)
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config: validatorConfig } = this
    const { nameOf } = context
    const schemas = sortBy(getNamedSchemas(context), (schema) => nameOf(schema, 'json-schema/type-validator'))
    const data = mergeTypeScriptModules(
      schemas.map((schema): TypeScriptModule => generateValidator(schema, context, validatorConfig)),
    )
    return {
      data,
      isOk: true,
      issues: [],
    }
  }

  public referenceOf(input: SchemaObject | ReferenceObject): Expression {
    const { context, config: config } = this
    const { nameOf, dereference } = context
    const schema = dereference(input)
    const name = nameOf(schema, 'json-schema/type-validator')
    return isNil(name) ? getRightHandSideValidatorAst(input, context, config, 0) : factory.createIdentifier(name)
  }

  public dependenciesOf(fromPath: string, input: SchemaObject | ReferenceObject): ImportDeclaration[] {
    const { context, config: config } = this
    return getValidatorImports(fromPath, input, context, config, collectExternalReferenceImports)
  }
}
