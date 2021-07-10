import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
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
import { Expression, ImportDeclaration } from 'typescript'
import { SchemaObject, ReferenceObject, isReferenceObject } from 'openapi3-ts'
import { getReferenceValidatorAst } from './getReferenceValidatorAst'
import { collectExternalReferenceImports, getValidatorImports } from './getValidatorImports'
import { isOk } from '@oats-ts/validators'

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

  public reference(input: SchemaObject | ReferenceObject, target: OpenAPIGeneratorTarget): Expression {
    const { context, config } = this
    const { uriOf } = context
    switch (target) {
      case 'openapi/validator':
        const ref = isReferenceObject(input) ? input : { $ref: uriOf(input) }
        return getReferenceValidatorAst(ref, context, config, false, true)
      default:
        return undefined
    }
  }

  public dependencies(
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
