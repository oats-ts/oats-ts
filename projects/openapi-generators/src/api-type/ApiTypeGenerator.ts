import { EnhancedOperation, hasInput, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import {
  factory,
  ImportDeclaration,
  MethodSignature,
  ParameterDeclaration,
  SourceFile,
  Statement,
  SyntaxKind,
  TypeReferenceNode,
} from 'typescript'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, documentNode, getModelImports } from '@oats-ts/typescript-common'
import { ApiTypeGeneratorConfig } from './typings'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'
import { RuntimeDependency } from '@oats-ts/oats-ts'
import { flatMap } from 'lodash'

export class ApiTypeGenerator extends DocumentBasedCodeGenerator<ApiTypeGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/api-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/request-server-type', 'oats/response-server-type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return []
  }

  public referenceOf(input: OpenAPIObject): TypeReferenceNode | undefined {
    const [operations] = this.items
    return operations.length > 0
      ? factory.createTypeReferenceNode(this.context().nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [operations] = this.items
    return operations.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context()) : []
  }

  public async generateItem(operations: EnhancedOperation[]): Promise<Try<SourceFile>> {
    return success(
      createSourceFile(
        this.context().pathOf(this.context().document(), this.name()),
        this.getImportDeclarations(operations),
        [this.getApiTypeStatement(operations)],
      ),
    )
  }

  protected getImportDeclarations(operations: EnhancedOperation[]): ImportDeclaration[] {
    const apiPath = this.context().pathOf(this.context().document(), this.name())
    return flatMap(operations, (data) => [
      ...this.context().dependenciesOf<ImportDeclaration>(apiPath, data.operation, 'oats/request-server-type'),
      ...this.context().dependenciesOf<ImportDeclaration>(apiPath, data.operation, 'oats/response-server-type'),
    ])
  }

  protected getApiTypeStatement(operations: EnhancedOperation[]): Statement {
    return factory.createTypeAliasDeclaration(
      [],
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      this.context().nameOf(this.context().document(), this.name()),
      [],
      factory.createTypeLiteralNode(operations.map((operation) => this.getApiTypeMethodSignatureAst(operation))),
    )
  }

  protected getApiTypeMethodSignatureAst(data: EnhancedOperation): MethodSignature {
    const parameters: ParameterDeclaration[] = hasInput(data, this.context(), true)
      ? [
          factory.createParameterDeclaration(
            [],
            [],
            undefined,
            'request',
            undefined,
            this.context().referenceOf(data.operation, 'oats/request-server-type'),
          ),
        ]
      : []

    const returnType = factory.createTypeReferenceNode('Promise', [
      factory.createTypeReferenceNode(this.context().nameOf(data.operation, 'oats/response-server-type')),
    ])

    const node = factory.createMethodSignature(
      [],
      this.context().nameOf(data.operation, 'oats/operation'),
      undefined,
      [],
      parameters,
      returnType,
    )

    return this.configuration().documentation ? documentNode(node, data.operation) : node
  }
}
