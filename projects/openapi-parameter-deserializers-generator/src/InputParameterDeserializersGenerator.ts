import { Result, GeneratorConfig } from '@oats-ts/generator'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject, ParameterLocation } from '@oats-ts/openapi-model'
import { flatMap, isNil, isEmpty, negate, sortBy } from 'lodash'
import {
  generateHeaderParameterTypeDeserializer,
  generateOperationParameterTypeDeserializer,
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

export class InputParameterDeserializersGenerator implements OpenAPIGenerator {
  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & ParameterDeserializersGeneratorConfig
  private operations: EnhancedOperation[]
  private readonly location: ParameterLocation
  private readonly produced: OpenAPIGeneratorTarget
  private readonly consumed: OpenAPIGeneratorTarget
  private generator: (data: EnhancedOperation, context: OpenAPIGeneratorContext) => TypeScriptModule

  public readonly id: string
  public readonly produces: string[]
  public readonly consumes: string[]

  public constructor(
    id: string,
    consumed: OpenAPIGeneratorTarget,
    produced: OpenAPIGeneratorTarget,
    location: ParameterLocation,
    config: GeneratorConfig & ParameterDeserializersGeneratorConfig,
  ) {
    this.id = id
    this.produced = produced
    this.consumed = consumed
    this.consumes = ['openapi/type', consumed]
    this.produces = [produced]
    this.location = location
    this.config = config
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
    const { document, nameOf } = this.context
    this.operations = sortBy(getEnhancedOperations(document, this.context), ({ operation }) =>
      nameOf(operation, this.produced),
    )
    this.generator = generateOperationParameterTypeDeserializer(this.location, this.produced, this.consumed)
  }

  private enhance(input: OperationObject): EnhancedOperation {
    const operation = this.operations.find(({ operation }) => operation === input)
    if (isNil(operation)) {
      throw new Error(`${JSON.stringify(input)} is not a registered operation.`)
    }
    return operation
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context } = this

    const data: TypeScriptModule[] = mergeTypeScriptModules(
      flatMap(this.operations, (operation: EnhancedOperation): TypeScriptModule[] =>
        [this.generator(operation, context)].filter(negate(isNil)),
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
      case this.produced: {
        const params = this.enhance(input)[this.location]
        return isEmpty(params) ? undefined : factory.createIdentifier(nameOf(input, target))
      }
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: OperationObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    const { context } = this
    switch (target) {
      case this.produced: {
        const params = this.enhance(input)[this.location]
        return isEmpty(params) ? undefined : getModelImports(fromPath, target, [input], context)
      }
      default:
        return []
    }
  }
}
