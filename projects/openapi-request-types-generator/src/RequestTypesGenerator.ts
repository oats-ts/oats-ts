import { Result, GeneratorConfig } from '@oats-ts/generator'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject } from '@oats-ts/openapi-model'
import { flatMap, isNil, negate, sortBy } from 'lodash'
import { generateRequestType } from './generateRequestType'
import { RequestTypesGeneratorConfig } from './typings'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  hasInput,
} from '@oats-ts/openapi-common'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { Expression, TypeNode, ImportDeclaration, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class RequestTypesGenerator implements OpenAPIGenerator {
  public static id = 'openapi/request-types'
  private static consumes: OpenAPIGeneratorTarget[] = [
    'openapi/type',
    'openapi/request-headers-type',
    'openapi/query-type',
    'openapi/path-type',
  ]
  private static produces: OpenAPIGeneratorTarget[] = ['openapi/request-type']

  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & RequestTypesGeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id: string = RequestTypesGenerator.id
  public readonly produces: string[] = RequestTypesGenerator.produces
  public readonly consumes: string[]

  public constructor(config: GeneratorConfig & RequestTypesGeneratorConfig) {
    this.config = config
    this.consumes = RequestTypesGenerator.consumes
    this.produces = RequestTypesGenerator.produces
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
    const { document, nameOf } = this.context
    this.operations = sortBy(getEnhancedOperations(document, this.context), ({ operation }) =>
      nameOf(operation, 'openapi/operation'),
    )
  }

  private enhance(input: OperationObject): EnhancedOperation {
    const operation = this.operations.find(({ operation }) => operation === input)
    if (isNil(operation)) {
      throw new Error(`${JSON.stringify(input)} is not a registered operation.`)
    }
    return operation
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this

    const data: TypeScriptModule[] = mergeTypeScriptModules(
      flatMap(this.operations, (operation: EnhancedOperation): TypeScriptModule[] =>
        [generateRequestType(operation, context)].filter(negate(isNil)),
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
      case 'openapi/request-type': {
        return hasInput(this.enhance(input), context)
          ? factory.createTypeReferenceNode(nameOf(input, target))
          : undefined
      }
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: OperationObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    const { context } = this
    switch (target) {
      case 'openapi/request-type': {
        return hasInput(this.enhance(input), context)
          ? getModelImports(fromPath, target, [input], this.context)
          : undefined
      }
      default:
        return []
    }
  }
}
