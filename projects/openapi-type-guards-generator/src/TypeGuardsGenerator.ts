import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { isNil, negate, sortBy } from 'lodash'
import { OpenAPIGeneratorTarget, OpenAPIGeneratorConfig } from '@oats-ts/openapi'
import {
  getNamedSchemas,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { Result } from '@oats-ts/generator'
import { generateTypeGuard } from './generateTypeGuard'
import { TypeGuardGeneratorConfig } from './typings'
import { validateSchemas } from '@oats-ts/openapi-validators'
import { isOk } from '@oats-ts/validators'

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

  async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
    const schemas = sortBy(getNamedSchemas(context), (schema) => context.accessor.name(schema, 'openapi/type'))
    const issues = config.skipValidation ? [] : validateSchemas(schemas, context)
    const data = isOk(issues)
      ? mergeTypeScriptModules(
          schemas.map((schema) => generateTypeGuard(schema, context, config)).filter(negate(isNil)),
        )
      : undefined
    return {
      isOk: isOk(issues),
      issues,
      data,
    }
  }
}
