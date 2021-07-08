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
import { Try } from '@oats-ts/generator'
import { TypesGeneratorConfig } from './typings'
import { generateType } from './generateType'
import { getTypeReferenceAst } from './getTypeReferenceAst'
import { getTypeImports } from './getTypeImports'

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

  public async generate(): Promise<Try<TypeScriptModule[]>> {
    const { context, config } = this
    const schemas = sortBy(getNamedSchemas(context), (schema) => context.accessor.name(schema, 'openapi/type'))
    if (!config.skipValidation) {
      const issues = validateSchemas(schemas, context)
      if (issues.some((issue) => issue.severity === 'error')) {
        return { issues }
      }
    }
    const modules = schemas.map((schema): TypeScriptModule => generateType(schema, context, config))
    if (context.issues.some((issue) => issue.severity === 'error')) {
      return { issues: context.issues }
    }
    return mergeTypeScriptModules(modules)
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
