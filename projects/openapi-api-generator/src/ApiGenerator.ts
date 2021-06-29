import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  OpenAPIGeneratorConfig,
  createOpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { generateApiClass } from './apiClass/generateApiClass'
import { generateApiStub } from './apiStub/generateApiStub'
import { generateApiType } from './apiType/generateApiType'
import { ApiGeneratorConfig } from './typings'
import { Severity } from '@oats-ts/validators'
import { Try } from '@oats-ts/generator'

export class ApiGenerator implements OpenAPIGenerator {
  public static id = 'openapi/validators'
  public static consumes: OpenAPIGeneratorTarget[] = ['operation', 'operation-input-type']
  public static produces: OpenAPIGeneratorTarget[] = ['api-class', 'api-stub', 'api-type']

  private context: OpenAPIGeneratorContext = null
  private config: OpenAPIGeneratorConfig & ApiGeneratorConfig

  public readonly id: string = ApiGenerator.id
  public readonly produces: string[] = ApiGenerator.produces
  public readonly consumes: string[] = ApiGenerator.consumes

  public constructor(config: OpenAPIGeneratorConfig & ApiGeneratorConfig) {
    this.config = config
    this.produces = ApiGenerator.produces.filter((target) => {
      switch (target) {
        case 'api-type':
          return config.type
        case 'api-class':
          return config.class
        case 'api-stub':
          return config.stub
        default:
          return false
      }
    })
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
  }

  public async generate(): Promise<Try<TypeScriptModule[]>> {
    const { context, config } = this
    const document = context.accessor.document()
    const operations = sortBy(getEnhancedOperations(document, context), ({ operation }) =>
      context.accessor.name(operation, 'operation'),
    )
    const modules: TypeScriptModule[] = [
      ...(config.type ? [generateApiType(document, operations, context, config)] : []),
      ...(config.class ? [generateApiClass(document, operations, context, config)] : []),
      ...(config.stub ? [generateApiStub(document, operations, context, config)] : []),
    ]
    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return mergeTypeScriptModules(modules)
  }
}
