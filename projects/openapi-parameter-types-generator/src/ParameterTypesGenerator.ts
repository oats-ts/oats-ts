import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Severity } from '@oats-ts/validators'
import { flatMap, isNil, negate, sortBy } from 'lodash'
import {
  generateHeaderParametersType,
  generatePathParametersType,
  generateQueryParametersType,
} from './generateOperationParameterType'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { OpenAPIGeneratorTarget, OpenAPIGeneratorConfig } from '@oats-ts/openapi'
import { ParameterTypesGeneratorConfig } from './typings'
import { Try } from '@oats-ts/generator'

export class ParameterTypesGenerator implements OpenAPIGenerator {
  public static id = 'openapi/parameterTypes'
  public static consumes: OpenAPIGeneratorTarget[] = ['type']
  public static produces: OpenAPIGeneratorTarget[] = [
    'operation-headers-type',
    'operation-path-type',
    'operation-query-type',
  ]

  private context: OpenAPIGeneratorContext = null
  private config: OpenAPIGeneratorConfig & ParameterTypesGeneratorConfig

  public readonly id: string = ParameterTypesGenerator.id
  public readonly produces: string[] = ParameterTypesGenerator.produces
  public readonly consumes: string[] = ParameterTypesGenerator.consumes

  public constructor(config: OpenAPIGeneratorConfig & ParameterTypesGeneratorConfig) {
    this.config = config
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
  }

  public async generate(): Promise<Try<TypeScriptModule[]>> {
    const { context, config } = this
    const { accessor } = context
    const operations = sortBy(getEnhancedOperations(accessor.document(), context), ({ operation }) =>
      accessor.name(operation, 'operation'),
    )
    const modules: TypeScriptModule[] = flatMap(operations, (operation: EnhancedOperation): TypeScriptModule[] => {
      return [
        generatePathParametersType(operation, context, config),
        generateQueryParametersType(operation, context, config),
        generateHeaderParametersType(operation, context, config),
      ].filter(negate(isNil))
    })

    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return mergeTypeScriptModules(modules)
  }
}
