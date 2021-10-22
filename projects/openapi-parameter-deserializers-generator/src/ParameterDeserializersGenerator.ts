import { Result, GeneratorConfig } from '@oats-ts/generator'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject } from '@oats-ts/openapi-model'
import { flatMap, isNil, isEmpty, negate, sortBy } from 'lodash'
import {
  generateHeaderParameterTypeDeserializer,
  generatePathParameterTypeDeserializer,
  generateQueryParameterTypeDeserializer,
} from './generateOperationParameterTypeDeserializer'
import { ParameterDeserializersGeneratorConfig } from './typings'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { Expression, TypeNode, ImportDeclaration, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class ParameterDeserializersGenerator implements OpenAPIGenerator {
  public static id = 'openapi/parameter-deserializers'
  private static consumes: OpenAPIGeneratorTarget[] = [
    'openapi/type',
    'openapi/request-headers-type',
    'openapi/query-type',
    'openapi/path-type',
    'openapi/operation',
  ]
  private static produces: OpenAPIGeneratorTarget[] = [
    'openapi/request-headers-deserializer',
    'openapi/path-deserializer',
    'openapi/query-deserializer',
  ]

  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & ParameterDeserializersGeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id: string = ParameterDeserializersGenerator.id
  public readonly produces: string[] = ParameterDeserializersGenerator.produces
  public readonly consumes: string[]

  public constructor(config: GeneratorConfig & ParameterDeserializersGeneratorConfig) {
    this.config = config
    this.consumes = ParameterDeserializersGenerator.consumes
    this.produces = ParameterDeserializersGenerator.produces
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
        [
          generatePathParameterTypeDeserializer(operation, context),
          generateQueryParameterTypeDeserializer(operation, context),
          generateHeaderParameterTypeDeserializer(operation, context),
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
      case 'openapi/request-headers-deserializer': {
        const { header } = this.enhance(input)
        return isEmpty(header) ? undefined : factory.createIdentifier(nameOf(input, target))
      }
      case 'openapi/path-deserializer': {
        const { path } = this.enhance(input)
        return isEmpty(path) ? undefined : factory.createIdentifier(nameOf(input, target))
      }
      case 'openapi/query-deserializer':
        const { query } = this.enhance(input)
        return isEmpty(query) ? undefined : factory.createIdentifier(nameOf(input, target))
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: OperationObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    const { context } = this
    switch (target) {
      case 'openapi/request-headers-deserializer': {
        const { header } = this.enhance(input)
        return isEmpty(header) ? undefined : getModelImports(fromPath, target, [input], context)
      }
      case 'openapi/path-deserializer': {
        const { path } = this.enhance(input)
        return isEmpty(path) ? undefined : getModelImports(fromPath, target, [input], context)
      }
      case 'openapi/query-deserializer':
        const { query } = this.enhance(input)
        return isEmpty(query) ? undefined : getModelImports(fromPath, target, [input], context)
      default:
        return []
    }
  }
}
