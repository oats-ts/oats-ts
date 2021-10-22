import { Result, GeneratorConfig } from '@oats-ts/generator'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject } from '@oats-ts/openapi-model'
import { flatMap, isNil, isEmpty, negate, sortBy } from 'lodash'
import {
  generateHeaderParameterTypeSerializer,
  generatePathParameterTypeSerializer,
  generateQueryParameterTypeSerializer,
} from './generateOperationParameterTypeSerializer'
import { ParameterSerializersGeneratorConfig } from './typings'
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

export class ParameterSerializersGenerator implements OpenAPIGenerator {
  public static id = 'openapi/parameter-serializers'
  private static consumes: OpenAPIGeneratorTarget[] = [
    'openapi/type',
    'openapi/request-headers-type',
    'openapi/query-type',
    'openapi/path-type',
  ]
  private static produces: OpenAPIGeneratorTarget[] = [
    'openapi/request-headers-serializer',
    'openapi/path-serializer',
    'openapi/query-serializer',
  ]

  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & ParameterSerializersGeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id: string = ParameterSerializersGenerator.id
  public readonly produces: string[] = ParameterSerializersGenerator.produces
  public readonly consumes: string[]

  public constructor(config: GeneratorConfig & ParameterSerializersGeneratorConfig) {
    this.config = config
    this.consumes = ParameterSerializersGenerator.consumes
    this.produces = ParameterSerializersGenerator.produces
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
          generatePathParameterTypeSerializer(operation, context),
          generateQueryParameterTypeSerializer(operation, context),
          generateHeaderParameterTypeSerializer(operation, context),
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
      case 'openapi/request-headers-serializer': {
        const { header } = this.enhance(input)
        return isEmpty(header) ? undefined : factory.createIdentifier(nameOf(input, target))
      }
      case 'openapi/path-serializer': {
        const { path } = this.enhance(input)
        return isEmpty(path) ? undefined : factory.createIdentifier(nameOf(input, target))
      }
      case 'openapi/query-serializer':
        const { query } = this.enhance(input)
        return isEmpty(query) ? undefined : factory.createIdentifier(nameOf(input, target))
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: OperationObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    const { context } = this
    switch (target) {
      case 'openapi/request-headers-serializer': {
        const { header } = this.enhance(input)
        return isEmpty(header) ? undefined : getModelImports(fromPath, target, [input], this.context)
      }
      case 'openapi/path-serializer': {
        const { path } = this.enhance(input)
        return isEmpty(path) ? undefined : getModelImports(fromPath, target, [input], this.context)
      }
      case 'openapi/query-serializer':
        const { query } = this.enhance(input)
        return isEmpty(query) ? undefined : getModelImports(fromPath, target, [input], this.context)
      default:
        return []
    }
  }
}
