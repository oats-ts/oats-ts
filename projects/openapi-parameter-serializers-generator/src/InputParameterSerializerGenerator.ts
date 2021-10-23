import { Result, GeneratorConfig } from '@oats-ts/generator'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject, ParameterLocation } from '@oats-ts/openapi-model'
import { flatMap, isNil, isEmpty, negate, sortBy } from 'lodash'
import { generateOperationParameterTypeSerializer } from './generateOperationParameterTypeSerializer'
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

export class InputParameterSerializerGenerator<Id extends OpenAPIGeneratorTarget> implements OpenAPIGenerator<Id> {
  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & ParameterSerializersGeneratorConfig
  private operations: EnhancedOperation[]
  private readonly location: ParameterLocation
  private readonly consumed: OpenAPIGeneratorTarget
  private generator: (data: EnhancedOperation, context: OpenAPIGeneratorContext) => TypeScriptModule

  public readonly id: Id
  public readonly consumes: OpenAPIGeneratorTarget[]

  public constructor(
    id: Id,
    consumed: OpenAPIGeneratorTarget,
    location: ParameterLocation,
    config: GeneratorConfig & ParameterSerializersGeneratorConfig,
  ) {
    this.id = id
    this.consumed = consumed
    this.consumes = ['openapi/type', consumed]
    this.location = location
    this.config = config
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
    const { document, nameOf } = this.context
    this.operations = sortBy(getEnhancedOperations(document, this.context), ({ operation }) =>
      nameOf(operation, this.id),
    )
    this.generator = generateOperationParameterTypeSerializer(this.location, this.id, this.consumed)
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

  public referenceOf(input: OperationObject): TypeNode | Expression {
    const { context } = this
    const { nameOf } = context
    const params = this.enhance(input)[this.location]
    return isEmpty(params) ? undefined : factory.createIdentifier(nameOf(input, this.id))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    const { context } = this
    const params = this.enhance(input)[this.location]
    return isEmpty(params) ? undefined : getModelImports(fromPath, this.id, [input], context)
  }
}
