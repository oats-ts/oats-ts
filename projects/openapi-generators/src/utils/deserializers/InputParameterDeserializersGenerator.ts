import { BaseCodeGenerator } from '@oats-ts/generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject, ParameterLocation } from '@oats-ts/openapi-model'
import { isNil, isEmpty, sortBy } from 'lodash'
import { generateOperationParameterTypeDeserializer } from './generateOperationParameterTypeDeserializer'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'

export class InputParameterDeserializersGenerator extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  EnhancedOperation,
  OpenAPIGeneratorContext
> {
  private readonly _name: OpenAPIGeneratorTarget
  private readonly _consumed: OpenAPIGeneratorTarget
  private readonly _location: ParameterLocation
  private readonly _generate: (data: EnhancedOperation, context: OpenAPIGeneratorContext) => SourceFile

  public constructor(name: OpenAPIGeneratorTarget, consumed: OpenAPIGeneratorTarget, location: ParameterLocation) {
    super()
    this._name = name
    this._consumed = consumed
    this._location = location

    this._generate = generateOperationParameterTypeDeserializer(location, name, consumed)
  }

  public name(): OpenAPIGeneratorTarget {
    return this._name
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['json-schema/type', this._consumed]
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.ParameterDeserialization.name]
  }

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): EnhancedOperation[] {
    return sortBy(getEnhancedOperations(this.input.document, this.context), ({ operation }) =>
      this.context.nameOf(operation, this.name()),
    ).filter((data) => data[this._location].length > 0)
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    return success(this._generate(data, this.context))
  }

  public referenceOf(input: OperationObject): TypeNode | Expression {
    const params = this.enhance(input)[this._location]
    return isEmpty(params) ? undefined : factory.createIdentifier(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    const params = this.enhance(input)[this._location]
    return isEmpty(params) ? undefined : getModelImports(fromPath, this.name(), [input], this.context)
  }

  private enhance(input: OperationObject): EnhancedOperation {
    const operation = this.items.find(({ operation }) => operation === input)
    if (isNil(operation)) {
      throw new Error(`${JSON.stringify(input)} is not a registered operation.`)
    }
    return operation
  }
}
