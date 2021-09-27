import { Result, GeneratorConfig } from '@oats-ts/generator'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject } from '@oats-ts/openapi-model'
import { flatMap, isNil, isEmpty, negate, sortBy } from 'lodash'
import { generateOperationFunction } from './operation/generateOperationFunction'
import { generateResponseParserHint } from './expectations/generateExpectations'
import { OperationsGeneratorConfig } from './typings'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  hasInput,
  hasResponses,
} from '@oats-ts/openapi-common'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { Expression, TypeNode, ImportDeclaration, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class OperationsGenerator implements OpenAPIGenerator {
  public static id = 'openapi/operations'
  private static consumes: OpenAPIGeneratorTarget[] = [
    'openapi/type',
    'openapi/headers-type',
    'openapi/query-type',
    'openapi/path-type',
    'openapi/response-type',
    'openapi/request-type',
    'openapi/headers-serializer',
    'openapi/path-serializer',
    'openapi/query-serializer',
  ]
  private static produces: OpenAPIGeneratorTarget[] = ['openapi/operation', 'openapi/expectations']

  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & OperationsGeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id: string = OperationsGenerator.id
  public readonly produces: string[] = OperationsGenerator.produces
  public readonly consumes: string[]

  public constructor(config: GeneratorConfig & OperationsGeneratorConfig) {
    this.config = config
    this.consumes = OperationsGenerator.consumes.concat(config.validate ? ['openapi/validator'] : [])
    this.produces = OperationsGenerator.produces.concat(config.validate ? ['openapi/expectations'] : [])
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
    const { document, nameOf } = this.context
    this.operations = sortBy(getEnhancedOperations(document, this.context), ({ operation }) =>
      nameOf(operation, 'openapi/operation'),
    )
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this

    const data: TypeScriptModule[] = mergeTypeScriptModules(
      flatMap(this.operations, (operation: EnhancedOperation): TypeScriptModule[] =>
        [
          ...(config.validate ? [generateResponseParserHint(operation, context, config)] : []),
          generateOperationFunction(operation, context, config),
        ].filter(negate(isNil)),
      ),
    )

    // TODO maybe try-catch?
    return {
      isOk: true,
      issues: [],
      data,
    }
  }

  public referenceOf(input: OperationObject, target: OpenAPIGeneratorTarget): TypeNode | Expression {
    const { context } = this
    const { nameOf } = context
    switch (target) {
      case 'openapi/operation': {
        return factory.createIdentifier(nameOf(input, target))
      }
      case 'openapi/expectations': {
        return hasResponses(input, context) ? factory.createIdentifier(nameOf(input, target)) : undefined
      }
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: OperationObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    const { context } = this
    switch (target) {
      case 'openapi/operation': {
        return getModelImports(fromPath, target, [input], this.context)
      }
      case 'openapi/expectations': {
        return hasResponses(input, context) ? getModelImports(fromPath, target, [input], this.context) : undefined
      }
      default:
        return []
    }
  }
}
