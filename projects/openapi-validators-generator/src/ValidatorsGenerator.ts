import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Severity } from '@oats-ts/validators'
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
import { Try } from '@oats-ts/generator'
import { Expression, ImportDeclaration } from 'typescript'
import { SchemaObject, ReferenceObject, isReferenceObject } from 'openapi3-ts'
import { getReferenceValidatorAst } from './getReferenceValidatorAst'
import { collectExternalReferenceImports, getValidatorImports } from './getValidatorImports'

export class ValidatorsGenerator implements OpenAPIGenerator {
  public static id = 'openapi/validators'
  public static consumes: OpenAPIGeneratorTarget[] = ['type']
  public static produces: OpenAPIGeneratorTarget[] = ['validator']

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

  public async generate(): Promise<Try<TypeScriptModule[]>> {
    const { context, config } = this
    const schemas = sortBy(getNamedSchemas(context), (schema) => context.accessor.name(schema, 'type'))
    const modules = schemas.map((schema): TypeScriptModule => generateValidator(schema, context, config))
    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return mergeTypeScriptModules(modules)
  }

  public reference(input: SchemaObject | ReferenceObject, target: OpenAPIGeneratorTarget): Expression {
    const { context, config } = this
    const { accessor } = context
    switch (target) {
      case 'validator':
        const ref = isReferenceObject(input) ? input : { $ref: accessor.uri(input) }
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
      case 'validator':
        return getValidatorImports(fromPath, input, context, config, collectExternalReferenceImports)
      default:
        return []
    }
  }
}
