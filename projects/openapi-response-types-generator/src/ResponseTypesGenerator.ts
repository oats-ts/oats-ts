import { Result, GeneratorConfig } from '@oats-ts/generator'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject } from '@oats-ts/openapi-model'
import { flatMap, isNil, negate, sortBy } from 'lodash'
import { generateOperationReturnType } from './generateOperationReturnType'
import { ResponseTypesGeneratorConfig } from './typings'
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

export class ResponseTypesGenerator implements OpenAPIGenerator {
  public static id = 'openapi/response-types'
  private static consumes: OpenAPIGeneratorTarget[] = ['openapi/type']
  private static produces: OpenAPIGeneratorTarget[] = ['openapi/response-type']

  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & ResponseTypesGeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id: string = ResponseTypesGenerator.id
  public readonly produces: string[] = ResponseTypesGenerator.produces
  public readonly consumes: string[]

  public constructor(config: GeneratorConfig & ResponseTypesGeneratorConfig) {
    this.config = config
    this.consumes = ResponseTypesGenerator.consumes
    this.produces = ResponseTypesGenerator.produces
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
    const { document, nameOf } = this.context
    this.operations = sortBy(getEnhancedOperations(document, this.context), ({ operation }) =>
      nameOf(operation, 'openapi/operation'),
    )
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context } = this

    const data: TypeScriptModule[] = mergeTypeScriptModules(
      flatMap(this.operations, (operation: EnhancedOperation): TypeScriptModule[] =>
        [generateOperationReturnType(operation, context)].filter(negate(isNil)),
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
      case 'openapi/response-type': {
        return hasResponses(input, context) ? factory.createTypeReferenceNode(nameOf(input, target)) : undefined
      }
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: OperationObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    const { context } = this
    switch (target) {
      case 'openapi/response-type': {
        return hasResponses(input, context) ? getModelImports(fromPath, target, [input], this.context) : []
      }
      default:
        return []
    }
  }
}
