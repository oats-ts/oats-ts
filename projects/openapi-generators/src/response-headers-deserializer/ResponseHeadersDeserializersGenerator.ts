import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import {
  EnhancedOperation,
  getResponseHeaders,
  hasResponseHeaders,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { OperationObject } from '@oats-ts/openapi-model'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { entries, flatMap, values } from 'lodash'
import {
  factory,
  Identifier,
  ImportDeclaration,
  NodeFlags,
  PropertyAssignment,
  SourceFile,
  Statement,
  SyntaxKind,
} from 'typescript'
import { getDslObjectAst } from '../utils/getDslObjectAst'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'

export class ResponseHeadersDeserializersGenerator extends OperationBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/response-headers-deserializer'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type', 'oats/response-headers-type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: this.paramsPkg.name, version }]
  }

  protected shouldGenerate(item: EnhancedOperation): boolean {
    return hasResponseHeaders(item.operation, this.context())
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context().pathOf(data.operation, this.name())
    return success(
      createSourceFile(path, this.getImportDeclarations(path, data), [this.getResponseHeadersDeserializerAst(data)]),
    )
  }

  private getImportDeclarations(path: string, data: EnhancedOperation): ImportDeclaration[] {
    const headersByStatus = getResponseHeaders(data.operation, this.context())
    return [
      getNamedImports(this.paramsPkg.name, [this.paramsPkg.imports.dsl, this.paramsPkg.imports.deserializers]),
      ...flatMap(entries(headersByStatus), ([statusCode]) =>
        this.context().dependenciesOf<ImportDeclaration>(
          path,
          [data.operation, statusCode],
          'oats/response-headers-type',
        ),
      ),
    ]
  }

  protected getResponseHeadersDeserializerAst(data: EnhancedOperation): Statement {
    const headers = entries(getResponseHeaders(data.operation, this.context()))
    const props = headers
      .filter(([, headers]) => values(headers).length > 0)
      .map(([status, headers]): PropertyAssignment => {
        return factory.createPropertyAssignment(
          status === 'default' ? factory.createStringLiteral(status) : factory.createNumericLiteral(status),
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(this.paramsPkg.exports.deserializers),
              this.paramsPkg.content.deserializers.createHeaderDeserializer,
            ),
            [this.context().referenceOf([data.operation, status], 'oats/response-headers-type')],
            [getDslObjectAst(values(headers), this.context(), this.paramsPkg)],
          ),
        )
      })

    return factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            this.context().nameOf(data.operation, this.name()),
            undefined,
            undefined,
            factory.createAsExpression(
              factory.createObjectLiteralExpression(props),
              factory.createTypeReferenceNode('const'),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  public referenceOf(input: OperationObject): Identifier | undefined {
    return hasResponseHeaders(input, this.context())
      ? factory.createIdentifier(this.context().nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasResponseHeaders(input, this.context())
      ? getModelImports(fromPath, this.name(), [input], this.context())
      : []
  }
}
