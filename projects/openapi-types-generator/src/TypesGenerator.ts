import { ReferenceObject, SchemaObject } from 'openapi3-ts'
import { TypeNode } from 'typescript'
import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Severity } from '@oats-ts/validators'
import { sortBy } from 'lodash'
import {
  getNamedSchemas,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  OpenAPIGeneratorConfig,
  createOpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { Try } from '@oats-ts/generator'
import { TypesGeneratorConfig } from './typings'
import { generateType } from './generateType'
import { getTypeReferenceAst } from './getTypeReferenceAst'

export class TypesGenerator implements OpenAPIGenerator {
  public static id = 'openapi/types'
  public static consumes: OpenAPIGeneratorTarget[] = []
  public static produces: OpenAPIGeneratorTarget[] = ['type']

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
    const schemas = sortBy(getNamedSchemas(context), (schema) => context.accessor.name(schema, 'type'))
    const modules = schemas.map((schema): TypeScriptModule => generateType(schema, context, config))
    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return mergeTypeScriptModules(modules)
  }

  public reference(input: SchemaObject | ReferenceObject, target: OpenAPIGeneratorTarget): TypeNode {
    const { context, config } = this
    switch (target) {
      case 'type':
        return getTypeReferenceAst(input, context, config)
      default:
        return undefined
    }
  }
}
