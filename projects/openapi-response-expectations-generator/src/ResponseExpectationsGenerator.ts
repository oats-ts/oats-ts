import { Result, GeneratorConfig } from '@oats-ts/generator'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject } from '@oats-ts/openapi-model'
import { flatMap, isNil, negate, sortBy } from 'lodash'
import { generateResponseParserHint } from './generateExpectations'
import { ResponseExpectationsGeneratorConfig } from './typings'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  hasResponses,
} from '@oats-ts/openapi-common'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { Expression, TypeNode, ImportDeclaration, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class ResponseExpectationsGenerator implements OpenAPIGenerator {
  public static id = 'openapi/response-expectations'
  private static consumes: OpenAPIGeneratorTarget[] = ['openapi/type', 'openapi/validator']
  private static produces: OpenAPIGeneratorTarget[] = ['openapi/expectations']

  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & ResponseExpectationsGeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id: string = ResponseExpectationsGenerator.id
  public readonly produces: string[] = ResponseExpectationsGenerator.produces
  public readonly consumes: string[]

  public constructor(config: GeneratorConfig & ResponseExpectationsGeneratorConfig) {
    this.config = config
    this.consumes = ResponseExpectationsGenerator.consumes
    this.produces = ResponseExpectationsGenerator.produces
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
        [generateResponseParserHint(operation, context, config)].filter(negate(isNil)),
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
      case 'openapi/expectations': {
        return hasResponses(input, context) ? getModelImports(fromPath, target, [input], this.context) : undefined
      }
      default:
        return []
    }
  }
}
