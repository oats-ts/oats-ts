import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { EnhancedOperation, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { OperationObject } from '@oats-ts/openapi-model'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { isEmpty } from 'lodash'
import { Expression, factory, ImportDeclaration, NodeFlags, SourceFile, SyntaxKind } from 'typescript'
import { getDslObjectAst } from '../utils/dsl/getDslObjectAst'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'

export class QueryDeserializersGenerator extends OperationBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/query-deserializer'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/query-type']
  }
  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: RuntimePackages.ParameterSerialization.name, version }]
  }
  protected shouldGenerate(item: EnhancedOperation): boolean {
    return item.query.length > 0
  }
  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, this.name())
    return success(
      createSourceFile(
        path,
        [
          getNamedImports(RuntimePackages.ParameterSerialization.name, [
            RuntimePackages.ParameterSerialization.dsl,
            RuntimePackages.ParameterSerialization.createQueryDeserializer,
          ]),
          ...this.context.dependenciesOf(path, data.operation, 'oats/query-type'),
        ],
        [
          factory.createVariableStatement(
            [factory.createModifier(SyntaxKind.ExportKeyword)],
            factory.createVariableDeclarationList(
              [
                factory.createVariableDeclaration(
                  this.context.nameOf(data.operation, this.name()),
                  undefined,
                  undefined,
                  factory.createCallExpression(
                    factory.createIdentifier(RuntimePackages.ParameterSerialization.createQueryDeserializer),
                    [this.context.referenceOf(data.operation, 'oats/query-type')],
                    [getDslObjectAst(data.query, this.context)],
                  ),
                ),
              ],
              NodeFlags.Const,
            ),
          ),
        ],
      ),
    )
  }

  public referenceOf(input: OperationObject): Expression | undefined {
    const params = this.enhanced(input)?.query ?? []
    return isEmpty(params) ? undefined : factory.createIdentifier(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    const params = this.enhanced(input)?.query ?? []
    return isEmpty(params) ? [] : getModelImports(fromPath, this.name(), [input], this.context)
  }
}
