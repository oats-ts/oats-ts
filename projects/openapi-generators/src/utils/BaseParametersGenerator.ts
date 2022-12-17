import { Referenceable } from '@oats-ts/json-schema-model'
import { GeneratorInit, RuntimeDependency, version } from '@oats-ts/oats-ts'
import { OpenAPIGeneratorTarget, EnhancedOperation, OpenAPIReadOutput } from '@oats-ts/openapi-common'
import { BaseParameterObject, OperationObject } from '@oats-ts/openapi-model'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import {
  Expression,
  factory,
  Identifier,
  ImportDeclaration,
  NodeFlags,
  PropertyAssignment,
  SourceFile,
  Statement,
  SyntaxKind,
} from 'typescript'
import { ParameterDescriptorsGenerator } from './internalTypes'
import { ParametersFields } from './OatsApiNames'
import { OperationBasedCodeGenerator } from './OperationBasedCodeGenerator'

export abstract class BaseParameterGenerators extends OperationBasedCodeGenerator<{}> {
  protected descriptorsGenerator!: ParameterDescriptorsGenerator

  public abstract name(): OpenAPIGeneratorTarget

  protected abstract getParameters(item: EnhancedOperation): Referenceable<BaseParameterObject>[]

  protected abstract createParameterDescriptorsGenerator(): ParameterDescriptorsGenerator

  public initialize(init: GeneratorInit<OpenAPIReadOutput, SourceFile>): void {
    super.initialize(init)
    this.descriptorsGenerator = this.createParameterDescriptorsGenerator()
  }

  public referenceOf(input: OperationObject): Identifier | undefined {
    return this.shouldGenerate(this.enhanced(input))
      ? factory.createIdentifier(this.context().nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return this.shouldGenerate(this.enhanced(input))
      ? getModelImports(fromPath, this.name(), [input], this.context())
      : []
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [
      { name: this.paramsPkg.name, version },
      { name: this.rulesPkg.name, version },
    ]
  }

  protected shouldGenerate(item: EnhancedOperation): boolean {
    return this.getParameters(item).length > 0
  }

  protected async generateItem(item: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context().pathOf(item.operation, this.name())
    return success(createSourceFile(path, this.getImports(path, item), [this.getParametersStatementAst(item)]))
  }

  protected getImports(path: string, data: EnhancedOperation): ImportDeclaration[] {
    return this.descriptorsGenerator.getImports(path, data.operation, this.getParameters(data))
  }

  protected getParametersStatementAst(item: EnhancedOperation): Statement {
    return factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(this.context().nameOf(item.operation, this.name())),
            undefined,
            this.descriptorsGenerator.getParametersTypeAst(item.operation),
            this.getParametersExpressionAst(item),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getParameterDescriptorAssignment(item: EnhancedOperation): PropertyAssignment {
    return factory.createPropertyAssignment(
      ParametersFields.parameters,
      this.descriptorsGenerator.getParameterDescriptorAst(this.getParameters(item)),
    )
  }

  protected getSchemaAssignment(item: EnhancedOperation): PropertyAssignment {
    return factory.createPropertyAssignment(
      ParametersFields.schema,
      this.descriptorsGenerator.getValidatorSchemaAst(this.getParameters(item)),
    )
  }

  protected getPropertyAssignments(item: EnhancedOperation): PropertyAssignment[] {
    return [this.getParameterDescriptorAssignment(item), this.getSchemaAssignment(item)]
  }

  protected getParametersExpressionAst(item: EnhancedOperation): Expression {
    return factory.createObjectLiteralExpression(this.getPropertyAssignments(item))
  }
}
