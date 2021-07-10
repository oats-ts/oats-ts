import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { TypeNode, ImportDeclaration } from 'typescript'
import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { validateSchemas } from '@oats-ts/openapi-validators'
import { sortBy } from 'lodash'
import {
  getNamedSchemas,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { OpenAPIGeneratorTarget, OpenAPIGeneratorConfig } from '@oats-ts/openapi'
import { TypesGeneratorConfig } from './typings'
import { generateType } from './generateType'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { getTypeImports } from './getTypeImports'
import { isOk, Issue } from '@oats-ts/validators'
import { Result } from '@oats-ts/generator'

export class TypesGenerator implements OpenAPIGenerator {
  public static id = 'openapi/types'
  private static consumes: OpenAPIGeneratorTarget[] = []
  private static produces: OpenAPIGeneratorTarget[] = ['openapi/type']

  private context: OpenAPIGeneratorContext = null
  private config: OpenAPIGeneratorConfig & TypesGeneratorConfig

  public readonly id: string = TypesGenerator.id
  public readonly produces: string[] = TypesGenerator.produces
  public readonly consumes: string[] = TypesGenerator.consumes

  public constructor(config: OpenAPIGeneratorConfig & TypesGeneratorConfig) {
    this.config = config
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
    const { nameOf } = context
    const schemas = sortBy(getNamedSchemas(context), (schema) => nameOf(schema, 'openapi/type'))
    const issues = config.skipValidation ? [] : validateSchemas(schemas, context)
    const data = isOk(issues)
      ? mergeTypeScriptModules(schemas.map((schema): TypeScriptModule => generateType(schema, context, config)))
      : undefined
    return {
      isOk: isOk(issues),
      data,
      issues,
    }
  }

  public reference(input: SchemaObject | ReferenceObject, target: OpenAPIGeneratorTarget): TypeNode {
    const { context, config } = this
    switch (target) {
      case 'openapi/type':
        return getTypeReferenceAst(input, context, config)
      default:
        return undefined
    }
  }

  public dependencies(
    fromPath: string,
    input: SchemaObject | ReferenceObject,
    target: OpenAPIGeneratorTarget,
  ): ImportDeclaration[] {
    switch (target) {
      case 'openapi/type':
        return getTypeImports(fromPath, input, this.context, true)
      default:
        return []
    }
  }
}
