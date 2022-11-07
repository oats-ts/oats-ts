import { flatMap, isNil } from 'lodash'
import { OpenAPIGeneratorTarget, EnhancedOperation } from '@oats-ts/openapi-common'
import { SdkGeneratorConfig } from '../utils/sdkTypings'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import {
  TypeNode,
  Expression,
  factory,
  ImportDeclaration,
  SourceFile,
  Statement,
  SyntaxKind,
  MethodDeclaration,
  TypeReferenceNode,
  ParameterDeclaration,
} from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { Try, success } from '@oats-ts/try'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'

export class SdkImplementationGenerator extends DocumentBasedCodeGenerator<SdkGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/sdk-impl'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/operation', 'oats/request-type', 'oats/response-type', 'oats/sdk-type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: this.httpPkg.name, version }]
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression | undefined {
    const [operations] = this.items
    return operations.length > 0 ? factory.createIdentifier(this.context().nameOf(input, this.name())) : undefined
  }
  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [operations] = this.items
    return operations.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context()) : []
  }

  public async generateItem(operations: EnhancedOperation[]): Promise<Try<SourceFile>> {
    const path = this.context().pathOf(this.input.document, this.name())
    return success(
      createSourceFile(path, this.getImportDeclarations(path, operations), [this.getSdkClassAst(operations)]),
    )
  }

  protected getAdapterName(): string {
    return 'adapter'
  }

  protected getImportDeclarations(path: string, operations: EnhancedOperation[]): ImportDeclaration[] {
    return [
      getNamedImports(this.httpPkg.name, [this.httpPkg.imports.ClientAdapter]),
      ...flatMap(operations, (data) => [
        ...this.context().dependenciesOf<ImportDeclaration>(path, data.operation, 'oats/request-type'),
        ...this.context().dependenciesOf<ImportDeclaration>(path, data.operation, 'oats/response-type'),
      ]),
      ...this.context().dependenciesOf<ImportDeclaration>(path, this.input.document, 'oats/sdk-type'),
      ...flatMap(operations, ({ operation }) =>
        this.context().dependenciesOf<ImportDeclaration>(path, operation, 'oats/operation'),
      ),
    ]
  }

  protected getSdkClassAst(operations: EnhancedOperation[]): Statement {
    const configField = factory.createPropertyDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ProtectedKeyword), factory.createModifier(SyntaxKind.ReadonlyKeyword)],
      this.getAdapterName(),
      undefined,
      factory.createTypeReferenceNode(this.httpPkg.exports.ClientAdapter),
      undefined,
    )

    const constructor = factory.createConstructorDeclaration(
      [],
      [factory.createModifier(SyntaxKind.PublicKeyword)],
      [
        factory.createParameterDeclaration(
          [],
          [],
          undefined,
          this.getAdapterName(),
          undefined,
          factory.createTypeReferenceNode(this.httpPkg.exports.ClientAdapter),
        ),
      ],
      factory.createBlock([
        factory.createExpressionStatement(
          factory.createBinaryExpression(
            factory.createPropertyAccessExpression(factory.createIdentifier('this'), this.getAdapterName()),
            SyntaxKind.EqualsToken,
            factory.createIdentifier(this.getAdapterName()),
          ),
        ),
      ]),
    )

    return factory.createClassDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      this.context().nameOf(this.context().document(), this.name()),
      [],
      [
        factory.createHeritageClause(SyntaxKind.ImplementsKeyword, [
          factory.createExpressionWithTypeArguments(
            factory.createIdentifier(this.context().nameOf(this.context().document(), 'oats/sdk-type')),
            [],
          ),
        ]),
      ],
      [configField, constructor, ...operations.map((operation) => this.getSdkClassMethodAst(operation))],
    )
  }

  protected getSdkClassMethodAst(data: EnhancedOperation): MethodDeclaration {
    const parameters = this.getSdkMethodParameterAsts(data)
    const responseType = this.context().referenceOf<TypeReferenceNode>(data.operation, 'oats/response-type')

    const returnStatement = factory.createReturnStatement(
      factory.createCallExpression(
        factory.createIdentifier(this.context().nameOf(data.operation, 'oats/operation')),
        [],
        [
          ...(parameters.length === 1 ? [factory.createIdentifier('request')] : []),
          factory.createPropertyAccessExpression(factory.createIdentifier('this'), this.getAdapterName()),
        ],
      ),
    )

    return factory.createMethodDeclaration(
      [],
      [factory.createModifier(SyntaxKind.PublicKeyword), factory.createModifier(SyntaxKind.AsyncKeyword)],
      undefined,
      this.context().nameOf(data.operation, 'oats/operation'),
      undefined,
      [],
      parameters,
      factory.createTypeReferenceNode('Promise', [
        isNil(responseType) ? factory.createTypeReferenceNode('void') : responseType,
      ]),
      factory.createBlock([returnStatement]),
    )
  }

  protected getSdkMethodParameterAsts(data: EnhancedOperation): ParameterDeclaration[] {
    const requestType = this.context().referenceOf<TypeReferenceNode>(data.operation, 'oats/request-type')
    return isNil(requestType)
      ? []
      : [factory.createParameterDeclaration([], [], undefined, 'request', undefined, requestType)]
  }
}
