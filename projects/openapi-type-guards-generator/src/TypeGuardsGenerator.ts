import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Severity } from '@oats-ts/validators'
import { isNil, negate, sortBy } from 'lodash'
import { OpenAPIGeneratorTarget, OpenAPIGeneratorConfig } from '@oats-ts/openapi'
import {
  getNamedSchemas,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { Try } from '@oats-ts/generator'
import { generateTypeGuard } from './generateTypeGuard'
import { TypeGuardGeneratorConfig } from './typings'

export class TypeGuardsGenerator implements OpenAPIGenerator {
  public static id = 'openapi/typeGuards'
  private static consumes: OpenAPIGeneratorTarget[] = ['openapi/type']
  private static produces: OpenAPIGeneratorTarget[] = ['openapi/type-guard']

  private context: OpenAPIGeneratorContext = null
  private config: OpenAPIGeneratorConfig & TypeGuardGeneratorConfig

  public readonly id: string = TypeGuardsGenerator.id
  public readonly produces: string[] = TypeGuardsGenerator.produces
  public readonly consumes: string[] = TypeGuardsGenerator.consumes

  constructor(config: OpenAPIGeneratorConfig & TypeGuardGeneratorConfig) {
    this.config = config
  }

  initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
  }

  async generate(): Promise<Try<TypeScriptModule[]>> {
    const { context, config } = this
    const schemas = sortBy(getNamedSchemas(context), (schema) => context.accessor.name(schema, 'openapi/type'))
    const modules = schemas
      .map((schema): TypeScriptModule => generateTypeGuard(schema, context, config))
      .filter(negate(isNil))
    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return mergeTypeScriptModules(modules)
  }
}
