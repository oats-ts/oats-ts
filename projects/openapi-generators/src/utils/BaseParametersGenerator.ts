import { Referenceable } from '@oats-ts/json-schema-model'
import { OpenApiParameterSerializationExports } from '@oats-ts/model-common/lib/packages'
import { GeneratorInit, RuntimeDependency, version } from '@oats-ts/oats-ts'
import { OpenAPIGeneratorTarget, EnhancedOperation } from '@oats-ts/openapi-common'
import { BaseParameterObject } from '@oats-ts/openapi-model'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, getNamedImports } from '@oats-ts/typescript-common'
import {
  Expression,
  factory,
  ImportDeclaration,
  NodeFlags,
  PropertyAssignment,
  SourceFile,
  Statement,
  SyntaxKind,
  TypeReferenceNode,
} from 'typescript'
import { ParameterDescriptorsGenerator } from './internalTypes'
import { ParametersFields } from './OatsApiNames'
import { OperationBasedCodeGenerator } from './OperationBasedCodeGenerator'

export abstract class BaseParameterGenerators extends OperationBasedCodeGenerator<{}> {
  protected descriptorsGenerator!: ParameterDescriptorsGenerator

  public abstract name(): OpenAPIGeneratorTarget

  public abstract consumes(): OpenAPIGeneratorTarget[]

  protected abstract getTypeGeneratorTarget(): OpenAPIGeneratorTarget

  protected abstract getParametersType(): keyof OpenApiParameterSerializationExports

  protected abstract getParameters(item: EnhancedOperation): Referenceable<BaseParameterObject>[]

  protected abstract createParameterDescriptorsGenerator(): ParameterDescriptorsGenerator

  public initialize(init: GeneratorInit<OpenAPIReadOutput, SourceFile>): void {
    super.initialize(init)
    this.descriptorsGenerator = this.createParameterDescriptorsGenerator()
  }

  public referenceOf(input: any) {
    throw new Error('Method not implemented.')
  }

  public dependenciesOf(fromPath: string, input: any): any[] {
    throw new Error('Method not implemented.')
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: this.paramsPkg.name, version }]
  }

  protected shouldGenerate(item: EnhancedOperation): boolean {
    return this.getParameters(item).length > 0
  }

  protected async generateItem(item: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context().pathOf(item.operation, this.name())
    return success(createSourceFile(path, this.getImports(path, item), [this.getParametersStatementAst(item)]))
  }

  protected getImports(path: string, data: EnhancedOperation): ImportDeclaration[] {
    return [
      getNamedImports(this.paramsPkg.name, [
        this.paramsPkg.imports.parameter,
        this.paramsPkg.imports[this.getParametersType()],
      ]),
      ...this.context().dependenciesOf<ImportDeclaration>(path, data.operation, this.getTypeGeneratorTarget()),
    ]
  }

  protected getParametersStatementAst(item: EnhancedOperation): Statement {
    const parametersTypeName = this.paramsPkg.exports[this.getParametersType()]
    const parameterType = this.context().referenceOf<TypeReferenceNode>(item.operation, this.getTypeGeneratorTarget())
    return factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(this.context().nameOf(item.operation, this.name())),
            undefined,
            factory.createTypeReferenceNode(factory.createIdentifier(parametersTypeName), [parameterType]),
            this.getParametersExpressionAst(item),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getParameterDescriptorAssignment(item: EnhancedOperation): PropertyAssignment {
    return factory.createPropertyAssignment(
      ParametersFields.descriptor,
      this.descriptorsGenerator.getParameterDescriptorAst(this.getParameters(item)),
    )
  }

  protected getPropertyAssignments(item: EnhancedOperation): PropertyAssignment[] {
    return [this.getParameterDescriptorAssignment(item)]
  }

  protected getParametersExpressionAst(item: EnhancedOperation): Expression {
    return factory.createObjectLiteralExpression(this.getPropertyAssignments(item))
  }
}
