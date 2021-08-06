import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy, isNil } from 'lodash'
import {
  getNamedSchemas,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { OpenAPIGeneratorTarget, OpenAPIGeneratorConfig } from '@oats-ts/openapi'
import { generateValidator } from './generateValidator'
import { ValidatorsGeneratorConfig } from './typings'
import { Result } from '@oats-ts/generator'
import { Expression, ImportDeclaration, factory } from 'typescript'
import { SchemaObject, ReferenceObject } from '@oats-ts/json-schema-model'
import { collectExternalReferenceImports, getValidatorImports } from './getValidatorImports'
import { getRightHandSideValidatorAst } from './getRightHandSideValidatorAst'

export class ValidatorsGenerator implements OpenAPIGenerator {
  public static id = 'openapi/validators'
  private static consumes: OpenAPIGeneratorTarget[] = ['openapi/type']
  private static produces: OpenAPIGeneratorTarget[] = ['openapi/validator']

  private context: OpenAPIGeneratorContext = null
  private config: OpenAPIGeneratorConfig & ValidatorsGeneratorConfig

  public readonly id: string = ValidatorsGenerator.id
  public readonly produces: string[] = ValidatorsGenerator.produces
  public readonly consumes: string[] = ValidatorsGenerator.consumes

  public constructor(config: OpenAPIGeneratorConfig & ValidatorsGeneratorConfig) {
    this.config = config
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
    const { nameOf } = context
    const schemas = sortBy(getNamedSchemas(context), (schema) => nameOf(schema, 'openapi/type'))
    const data = mergeTypeScriptModules(
      schemas.map((schema): TypeScriptModule => generateValidator(schema, context, config)),
    )
    return {
      data,
      isOk: true,
      issues: [],
    }
  }

  public referenceOf(input: SchemaObject | ReferenceObject, target: OpenAPIGeneratorTarget): Expression {
    const { context, config } = this
    const { nameOf, dereference } = context
    switch (target) {
      case 'openapi/validator':
        const schema = dereference(input)
        const name = nameOf(schema, 'openapi/validator')
        return isNil(name) ? getRightHandSideValidatorAst(input, context, config, 0) : factory.createIdentifier(name)
      default:
        return undefined
    }
  }

  public dependenciesOf(
    fromPath: string,
    input: SchemaObject | ReferenceObject,
    target: OpenAPIGeneratorTarget,
  ): ImportDeclaration[] {
    const { context, config } = this
    switch (target) {
      case 'openapi/validator':
        return getValidatorImports(fromPath, input, context, config, collectExternalReferenceImports)
      default:
        return []
    }
  }
}
