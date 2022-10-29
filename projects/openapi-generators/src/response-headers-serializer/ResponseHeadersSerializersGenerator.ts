import { OpenApiParameterSerializationPackage, packages } from '@oats-ts/model-common'
import { GeneratorInit, RuntimeDependency, version } from '@oats-ts/oats-ts'
import {
  EnhancedOperation,
  getResponseHeaders,
  hasResponseHeaders,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { OperationObject } from '@oats-ts/openapi-model'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
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

export class ResponseHeadersSerializersGenerator extends OperationBasedCodeGenerator<{}> {
  protected paramsPkg!: OpenApiParameterSerializationPackage

  public name(): OpenAPIGeneratorTarget {
    return 'oats/response-headers-serializer'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type', 'oats/response-headers-type']
  }

  public initialize(init: GeneratorInit<OpenAPIReadOutput, SourceFile>): void {
    super.initialize(init)
    this.paramsPkg = this.getParametersPackage()
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: this.paramsPkg.name, version }]
  }

  protected shouldGenerate(data: EnhancedOperation): boolean {
    return hasResponseHeaders(data.operation, this.context)
  }

  public referenceOf(input: OperationObject): Identifier | undefined {
    return hasResponseHeaders(input, this.context)
      ? factory.createIdentifier(this.context.nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasResponseHeaders(input, this.context) ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, this.name())
    return success(
      createSourceFile(path, this.getImportDeclarations(path, data), [this.getResponseHeadersSerializerAst(data)]),
    )
  }

  protected getImportDeclarations(path: string, data: EnhancedOperation): ImportDeclaration[] {
    const headersByStatus = getResponseHeaders(data.operation, this.context)
    return [
      getNamedImports(packages.openApiParameterSerialization.name, [
        this.paramsPkg.imports.dsl,
        this.paramsPkg.imports.serializers,
      ]),
      ...flatMap(entries(headersByStatus), ([statusCode]) =>
        this.context.dependenciesOf(path, [data.operation, statusCode], 'oats/response-headers-type'),
      ),
    ]
  }

  protected getResponseHeadersSerializerAst(data: EnhancedOperation): Statement {
    const headers = entries(getResponseHeaders(data.operation, this.context))
    const props = headers
      .filter(([, headers]) => values(headers).length > 0)
      .map(([status, headers]): PropertyAssignment => {
        return factory.createPropertyAssignment(
          status === 'default' ? factory.createStringLiteral(status) : factory.createNumericLiteral(status),
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(this.paramsPkg.exports.serializers),
              this.paramsPkg.content.serializers.createHeaderSerializer,
            ),
            [this.context.referenceOf([data.operation, status], 'oats/response-headers-type')],
            [getDslObjectAst(values(headers), this.context, this.paramsPkg)],
          ),
        )
      })

    return factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            this.context.nameOf(data.operation, this.name()),
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

  protected getParametersPackage(): OpenApiParameterSerializationPackage {
    return packages.openApiParameterSerialization(this.context)
  }
}
