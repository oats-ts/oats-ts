import { Try } from '@oats-ts/generator'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Severity } from '@oats-ts/validators'
import { flatMap, isNil, negate, sortBy } from 'lodash'
import { generateOperationFunction } from './operation/generateOperationFunction'
import { generateOperationReturnType } from './returnType/generateOperationReturnType'
import { generateOperationInputType } from './inputType/generateOperationInputType'
import {
  generateHeaderParameterTypeSerializer,
  generatePathParameterTypeSerializer,
  generateQueryParameterTypeSerializer,
} from './parameterSerializer/generateOperationParameterTypeSerializer'
import { generateResponseParserHint } from './responseParserHint/generateResponseParserHint'
import { OperationsGeneratorConfig } from './typings'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  OpenAPIGeneratorConfig,
  createOpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'

export class OperationsGenerator implements OpenAPIGenerator {
  public static id = 'openapi/operations'
  public static consumes: OpenAPIGeneratorTarget[] = [
    'type',
    'operation-headers-type',
    'operation-query-type',
    'operation-path-type',
  ]
  public static produces: OpenAPIGeneratorTarget[] = [
    'operation',
    'operation-response-type',
    'operation-input-type',
    'operation-headers-serializer',
    'operation-path-serializer',
    'operation-query-serializer',
    'operation-response-parser-hint',
  ]

  private context: OpenAPIGeneratorContext = null
  private config: OpenAPIGeneratorConfig & OperationsGeneratorConfig

  public readonly id: string = OperationsGenerator.id
  public readonly produces: string[] = OperationsGenerator.produces
  public readonly consumes: string[] = OperationsGenerator.consumes

  public constructor(config: OpenAPIGeneratorConfig & OperationsGeneratorConfig) {
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
        generateOperationReturnType(operation, context),
        generateOperationInputType(operation, context),
        generatePathParameterTypeSerializer(operation, context),
        generateQueryParameterTypeSerializer(operation, context),
        generateHeaderParameterTypeSerializer(operation, context),
        generateResponseParserHint(operation, context),
        generateOperationFunction(operation, context, config),
      ].filter(negate(isNil))
    })

    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return mergeTypeScriptModules(modules)
  }
}
