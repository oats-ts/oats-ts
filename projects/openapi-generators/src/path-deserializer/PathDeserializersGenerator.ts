import { EnhancedOperation, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { OperationObject } from '@oats-ts/openapi-model'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { isEmpty } from 'lodash'
import { Expression, factory, ImportDeclaration, NodeFlags, SourceFile, SyntaxKind } from 'typescript'
import { getPathParameterNames } from './pathUtils'
import { getDslObjectAst } from '../utils/dsl/getDslObjectAst'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'
import { createPathRegExp } from '@oats-ts/openapi-parameter-serialization'

export class PathDeserializersGenerator extends OperationBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/path-deserializer'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['openapi/path-type']
  }
  public runtimeDependencies(): string[] {
    return [RuntimePackages.ParameterSerialization.name]
  }
  protected shouldGenerate(item: EnhancedOperation): boolean {
    return item.path.length > 0
  }
  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, this.name())
    return success(
      createSourceFile(
        path,
        [
          getNamedImports(RuntimePackages.ParameterSerialization.name, [
            RuntimePackages.ParameterSerialization.dsl,
            RuntimePackages.ParameterSerialization.createPathDeserializer,
          ]),
          ...this.context.dependenciesOf(path, data.operation, 'openapi/path-type'),
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
                    factory.createIdentifier(RuntimePackages.ParameterSerialization.createPathDeserializer),
                    [this.context.referenceOf(data.operation, 'openapi/path-type')],
                    [
                      getDslObjectAst(data.path, this.context),
                      factory.createArrayLiteralExpression(
                        getPathParameterNames(data.url).map((name) => factory.createStringLiteral(name)),
                      ),
                      factory.createRegularExpressionLiteral(createPathRegExp(data.url).toString()),
                    ],
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
    const params = this.enhanced(input)?.path ?? []
    return isEmpty(params) ? undefined : factory.createIdentifier(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    const params = this.enhanced(input)?.path ?? []
    return isEmpty(params) ? [] : getModelImports(fromPath, this.name(), [input], this.context)
  }
}
