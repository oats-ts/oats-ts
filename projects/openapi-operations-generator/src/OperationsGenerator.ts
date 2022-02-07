import { Result, GeneratorConfig } from '@oats-ts/generator'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject } from '@oats-ts/openapi-model'
import { flatMap, isNil, negate, sortBy } from 'lodash'
import { generateOperationFunction } from './generateOperationFunction'
import { OperationsGeneratorConfig } from './typings'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class OperationsGenerator implements OpenAPIGenerator<'openapi/operation'> {
  private context: OpenAPIGeneratorContext = null
  private operationsConfig: OperationsGeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id = 'openapi/operation'
  public readonly consumes: OpenAPIGeneratorTarget[] = [
    'json-schema/type',
    'openapi/request-headers-type',
    'openapi/query-type',
    'openapi/path-type',
    'openapi/response-type',
    'openapi/request-type',
    'openapi/request-headers-serializer',
    'openapi/path-serializer',
    'openapi/query-serializer',
    'openapi/response-headers-deserializer',
  ]

  public constructor(config: OperationsGeneratorConfig) {
    this.operationsConfig = config
    if (config.validate) {
      this.consumes.push('openapi/response-body-validator')
    }
  }

  public initialize(data: OpenAPIReadOutput, config: GeneratorConfig, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, config, generators)
    const { document, nameOf } = this.context
    this.operations = sortBy(getEnhancedOperations(document, this.context), ({ operation }) =>
      nameOf(operation, 'openapi/operation'),
    )
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, operationsConfig } = this

    const data: TypeScriptModule[] = mergeTypeScriptModules(
      flatMap(this.operations, (operation: EnhancedOperation): TypeScriptModule[] =>
        [generateOperationFunction(operation, context, operationsConfig)].filter(negate(isNil)),
      ),
    )

    // TODO maybe try-catch?
    return {
      isOk: true,
      issues: [],
      data,
    }
  }

  public referenceOf(input: OperationObject): TypeNode | Expression {
    const { context } = this
    const { nameOf } = context
    return factory.createIdentifier(nameOf(input, this.id))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    const { context } = this
    return getModelImports(fromPath, this.id, [input], context)
  }
}
