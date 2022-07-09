import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OperationObject, ParameterLocation } from '@oats-ts/openapi-model'
import { isEmpty } from 'lodash'
import { EnhancedOperation, OpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { ParameterTypesGeneratorConfig } from './typings'
import { generateOperationParameterType } from './generateOperationParameterType'
import { success, Try } from '@oats-ts/try'
import { getModelImports } from '@oats-ts/typescript-common'
import { OperationBasedCodeGenerator } from '../OperationBasedCodeGenerator'

export class InputParameterTypesGenerator extends OperationBasedCodeGenerator<ParameterTypesGeneratorConfig> {
  private readonly _name: OpenAPIGeneratorTarget
  private readonly _location: ParameterLocation
  private readonly _generate: (
    data: EnhancedOperation,
    context: OpenAPIGeneratorContext,
    config: ParameterTypesGeneratorConfig,
  ) => SourceFile

  public constructor(
    config: ParameterTypesGeneratorConfig & Partial<GeneratorConfig>,
    name: OpenAPIGeneratorTarget,
    location: ParameterLocation,
  ) {
    super(config)
    this._name = name
    this._location = location

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

  protected shouldGenerate(data: EnhancedOperation): boolean {
    return data[this._location].length > 0
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    return success(this._generate(data, this.context, this.config))
  }

  public referenceOf(input: OperationObject): TypeNode | undefined {
    const params = this.enhanced(input)[this._location]
    return isEmpty(params) ? undefined : factory.createTypeReferenceNode(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    const params = this.enhanced(input)[this._location]
    return isEmpty(params) ? [] : getModelImports(fromPath, this.name(), [input], this.context)
  }
}
