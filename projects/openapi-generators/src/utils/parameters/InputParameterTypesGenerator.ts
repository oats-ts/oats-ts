import { BaseCodeGenerator } from '@oats-ts/generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject, ParameterLocation } from '@oats-ts/openapi-model'
import { isNil, isEmpty, sortBy } from 'lodash'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { ParameterTypesGeneratorConfig } from './typings'
import { generateOperationParameterType } from './generateOperationParameterType'
import { success, Try } from '@oats-ts/try'
import { getModelImports } from '@oats-ts/typescript-common'

export class InputParameterTypesGenerator extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  EnhancedOperation,
  OpenAPIGeneratorContext
> {
  private readonly config: ParameterTypesGeneratorConfig
  private readonly _name: OpenAPIGeneratorTarget
  private readonly _location: ParameterLocation
  private readonly _generate: (
    data: EnhancedOperation,
    context: OpenAPIGeneratorContext,
    config: ParameterTypesGeneratorConfig,
  ) => SourceFile

  public constructor(name: OpenAPIGeneratorTarget, location: ParameterLocation, config: ParameterTypesGeneratorConfig) {
    super()
    this._name = name
    this._location = location
    this.config = config

    this._generate = generateOperationParameterType(location)
  }

  public name(): OpenAPIGeneratorTarget {
    return this._name
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['json-schema/type']
  }

  public runtimeDependencies(): string[] {
    return []
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
    return success(this._generate(data, this.context, this.config))
  }

  private enhance(input: OperationObject): EnhancedOperation {
    const operation = this.items.find(({ operation }) => operation === input)
    if (isNil(operation)) {
      throw new Error(`${JSON.stringify(input)} is not a registered operation.`)
    }
    return operation
  }

  public referenceOf(input: OperationObject): TypeNode | Expression | undefined {
    const params = this.enhance(input)[this._location]
    return isEmpty(params) ? undefined : factory.createTypeReferenceNode(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    const params = this.enhance(input)[this._location]
    return isEmpty(params) ? [] : getModelImports(fromPath, this.name(), [input], this.context)
  }
}
