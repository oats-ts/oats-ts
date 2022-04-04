import { Result, GeneratorConfig, CodeGenerator } from '@oats-ts/generator'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject, ParameterLocation } from '@oats-ts/openapi-model'
import { flatMap, isNil, isEmpty, negate, sortBy } from 'lodash'
import { generateOperationParameterTypeDeserializer } from './generateOperationParameterTypeDeserializer'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class InputParameterDeserializersGenerator<Id extends OpenAPIGeneratorTarget> implements OpenAPIGenerator<Id> {
  private context: OpenAPIGeneratorContext = null
  private operations: EnhancedOperation[]
  private readonly location: ParameterLocation
  private readonly consumed: OpenAPIGeneratorTarget
  private generator: (data: EnhancedOperation, context: OpenAPIGeneratorContext) => TypeScriptModule

  public readonly id: Id
  public readonly consumes: OpenAPIGeneratorTarget[]
  public readonly runtimeDepencencies: string[] = [RuntimePackages.ParameterDeserialization.name]

  public constructor(id: Id, consumed: OpenAPIGeneratorTarget, location: ParameterLocation) {
    this.id = id
    this.consumed = consumed
    this.consumes = ['json-schema/type', consumed]
    this.location = location
  }

  public initialize(
    data: OpenAPIReadOutput,
    config: GeneratorConfig,
    generators: CodeGenerator<OpenAPIReadOutput, TypeScriptModule>[],
  ): void {
    this.context = createOpenAPIGeneratorContext(data, config, generators as OpenAPIGenerator[])
    const { document, nameOf } = this.context
    this.operations = sortBy(getEnhancedOperations(document, this.context), ({ operation }) =>
      nameOf(operation, this.id),
    )
    this.generator = generateOperationParameterTypeDeserializer(this.location, this.id, this.consumed)
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
