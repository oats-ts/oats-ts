import { GeneratorConfig } from '@oats-ts/generator'
import { OperationObject, ParameterLocation } from '@oats-ts/openapi-model'
import { isEmpty } from 'lodash'
import { generateOperationParameterTypeSerializer } from './generateOperationParameterTypeSerializer'
import {
  EnhancedOperation,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { OperationBasedCodeGenerator } from '../OperationBasedCodeGenerator'

export class InputParameterSerializerGenerator extends OperationBasedCodeGenerator<{}> {
  private readonly _name: OpenAPIGeneratorTarget
  private readonly _consumed: OpenAPIGeneratorTarget
  private readonly _location: ParameterLocation
  private readonly _generate: (data: EnhancedOperation, context: OpenAPIGeneratorContext) => SourceFile

  public constructor(
    config: Partial<GeneratorConfig>,
    name: OpenAPIGeneratorTarget,
    consumed: OpenAPIGeneratorTarget,
    location: ParameterLocation,
  ) {
    super(config)
    this._name = name
    this._consumed = consumed
    this._location = location

    this._generate = generateOperationParameterTypeSerializer(location, name, consumed)
  }

  public name(): OpenAPIGeneratorTarget {
    return this._name
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['json-schema/type', this._consumed]
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.ParameterSerialization.name]
  }

  protected shouldGenerate(data: EnhancedOperation): boolean {
    return data[this._location].length > 0
  }

  protected async generateItem(item: EnhancedOperation): Promise<Try<SourceFile>> {
    return success(this._generate(item, this.context))
  }

  public referenceOf(input: OperationObject): TypeNode | Expression | undefined {
    const params = this.enhanced(input)[this._location]
    return isEmpty(params) ? undefined : factory.createIdentifier(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    const params = this.enhanced(input)[this._location]
    return isEmpty(params) ? [] : getModelImports(fromPath, this.name(), [input], this.context)
  }
}
