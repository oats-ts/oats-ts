import { packages } from '@oats-ts/model-common'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseParameterObject, OperationObject } from '@oats-ts/openapi-model'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { isEmpty } from 'lodash'
import { Expression, factory, ImportDeclaration, NodeFlags, SourceFile, SyntaxKind } from 'typescript'
import { getDslObjectAst } from './getDslObjectAst'
import { OperationBasedCodeGenerator } from './OperationBasedCodeGenerator'

export abstract class BaseDslGenerator<T = {}> extends OperationBasedCodeGenerator<T> {
  protected abstract getTypeGeneratorTarget(): OpenAPIGeneratorTarget
  protected abstract getFactoryFunctionName(): string
  protected abstract getRuntimeExport(): string
  protected abstract getParameters(data: EnhancedOperation): BaseParameterObject[]

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: packages.openApiParameterSerialization.name, version }]
  }
  protected shouldGenerate(item: EnhancedOperation): boolean {
    return this.getParameters(item).length > 0
  }
  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, this.name())
    return success(
      createSourceFile(path, this.getImports(path, data), [
        factory.createVariableStatement(
          [factory.createModifier(SyntaxKind.ExportKeyword)],
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                this.context.nameOf(data.operation, this.name()),
                undefined,
                undefined,
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(this.getRuntimeExport()),
                    this.getFactoryFunctionName(),
                  ),
                  [this.context.referenceOf(data.operation, this.getTypeGeneratorTarget())],
                  [
                    getDslObjectAst(this.getParameters(data), this.context),
                    ...this.getExtraFactoryFunctionParameters(data),
                  ],
                ),
              ),
            ],
            NodeFlags.Const,
          ),
        ),
      ]),
    )
  }

  protected getImports(path: string, data: EnhancedOperation): ImportDeclaration[] {
    return [
      getNamedImports(packages.openApiParameterSerialization.name, [
        packages.openApiParameterSerialization.exports.dsl,
        this.getRuntimeExport(),
      ]),
      ...this.context.dependenciesOf(path, data.operation, this.getTypeGeneratorTarget()),
    ]
  }

  protected getExtraFactoryFunctionParameters(data: EnhancedOperation): Expression[] {
    return []
  }

  public referenceOf(input: OperationObject): Expression | undefined {
    const params = this.getParameters(this.enhanced(input))
    return isEmpty(params) ? undefined : factory.createIdentifier(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    const params = this.getParameters(this.enhanced(input))
    return isEmpty(params) ? [] : getModelImports(fromPath, this.name(), [input], this.context)
  }
}
