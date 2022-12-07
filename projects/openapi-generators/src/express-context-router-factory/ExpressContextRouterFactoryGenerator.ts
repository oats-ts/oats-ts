import { LocalNameDefaults, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import {
  TypeNode,
  Expression,
  factory,
  ImportDeclaration,
  SourceFile,
  ParameterDeclaration,
  SyntaxKind,
  Statement,
  Block,
} from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { ExpressContextRouterFactoryDefaultLocals } from './ExpressContextRouterFactoryDefaultLocals'
import { ExpressContextRouterFactoryLocals } from './typings'
import { ExpressFields } from '../utils/OatsApiNames'

export class ExpressContextRouterFactoryGenerator extends DocumentBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/express-context-router-factory'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/express-router-factory', 'oats/express-router-factories-type', 'oats/api-type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [
      { name: this.httpPkg.name, version },
      { name: this.adapterPkg.name, version },
      { name: this.expressPkg.name, version: '^4.18.1' },
    ]
  }

  protected getDefaultLocals(): LocalNameDefaults {
    return ExpressContextRouterFactoryDefaultLocals
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression | undefined {
    const [operations] = this.items
    return operations?.length > 0
      ? factory.createTypeReferenceNode(this.context().nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [operations] = this.items
    return operations?.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context()) : []
  }

  protected async generateItem(): Promise<Try<SourceFile>> {
    const path = this.context().pathOf(this.input.document, this.name())
    return success(createSourceFile(path, this.getImportDeclarations(path), [this.getRouterFactoryAst()]))
  }

  protected getImportDeclarations(path: string): ImportDeclaration[] {
    return [
      getNamedImports(this.expressPkg.name, [
        this.expressPkg.imports.IRouter,
        this.expressPkg.imports.Router,
        this.expressPkg.imports.NextFunction,
        this.expressPkg.imports.Request,
        this.expressPkg.imports.Response,
      ]),
      getNamedImports(this.httpPkg.name, [this.httpPkg.imports.ServerAdapter]),
      getNamedImports(this.adapterPkg.name, [this.adapterPkg.imports.ExpressToolkit]),
      ...getModelImports<OpenAPIGeneratorTarget>(path, 'oats/api-type', [this.input.document], this.context()),
    ]
  }

  protected getHandlerParamteters(): ParameterDeclaration[] {
    return [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(
          this.context().localNameOf<ExpressContextRouterFactoryLocals>(undefined, this.name(), 'request'),
        ),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier(this.expressPkg.exports.Request), undefined),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(
          this.context().localNameOf<ExpressContextRouterFactoryLocals>(undefined, this.name(), 'response'),
        ),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier(this.expressPkg.exports.Response), undefined),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(
          this.context().localNameOf<ExpressContextRouterFactoryLocals>(undefined, this.name(), 'next'),
        ),
        undefined,
        factory.createTypeReferenceNode(this.expressPkg.exports.NextFunction, undefined),
        undefined,
      ),
    ]
  }

  protected getFactoryParameters(): ParameterDeclaration[] {
    return [
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        factory.createIdentifier(
          this.context().localNameOf<ExpressContextRouterFactoryLocals>(undefined, this.name(), 'router'),
        ),
        undefined,
        factory.createUnionTypeNode([
          factory.createTypeReferenceNode(this.expressPkg.exports.IRouter, undefined),
          factory.createTypeReferenceNode('undefined', undefined),
        ]),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(
          this.context().localNameOf<ExpressContextRouterFactoryLocals>(undefined, this.name(), 'api'),
        ),
        undefined,
        factory.createTypeReferenceNode(this.context().referenceOf(this.context().document(), 'oats/api-type')),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(
          this.context().localNameOf<ExpressContextRouterFactoryLocals>(undefined, this.name(), 'adapter'),
        ),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier(this.httpPkg.exports.ServerAdapter), [
          factory.createTypeReferenceNode(factory.createIdentifier(this.adapterPkg.exports.ExpressToolkit), undefined),
        ]),
        undefined,
      ),
    ]
  }

  protected getRouterFactoryAst(): Statement {
    return factory.createFunctionDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      undefined,
      factory.createIdentifier(this.context().nameOf(this.context().document(), this.name())),
      undefined,
      this.getFactoryParameters(),
      factory.createTypeReferenceNode(factory.createIdentifier(this.expressPkg.exports.IRouter), undefined),
      this.getFactoryFunctionBodyBlockAst(),
    )
  }

  private getFactoryFunctionBodyBlockAst(): Block {
    return factory.createBlock([factory.createReturnStatement(this.getRouterExpressionAst())], true)
  }

  protected getRouterExpressionAst(): Expression {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createParenthesizedExpression(
          factory.createBinaryExpression(
            factory.createIdentifier(
              this.context().localNameOf<ExpressContextRouterFactoryLocals>(undefined, this.name(), 'router'),
            ),
            factory.createToken(SyntaxKind.QuestionQuestionToken),
            factory.createCallExpression(factory.createIdentifier(this.expressPkg.exports.Router), undefined, []),
          ),
        ),
        factory.createIdentifier(ExpressFields.use),
      ),
      undefined,
      [this.getHandlerArrowFunctionAst()],
    )
  }

  protected getHandlerArrowFunctionAst(): Expression {
    return factory.createArrowFunction(
      undefined,
      undefined,
      this.getHandlerParamteters(),
      undefined,
      factory.createToken(SyntaxKind.EqualsGreaterThanToken),
      this.getHandlerFunctionBodyBlockAst(),
    )
  }

  protected getHandlerFunctionBodyBlockAst(): Block {
    const statements = [
      this.getApiAssignmentStatementAst(),
      this.getAdapterAssignmentStatementAst(),
      this.getNextCallStatementAst(),
    ]
    return factory.createBlock(statements, true)
  }

  protected getNextCallStatementAst(): Statement {
    return factory.createExpressionStatement(
      factory.createCallExpression(
        factory.createIdentifier(
          this.context().localNameOf<ExpressContextRouterFactoryLocals>(undefined, this.name(), 'next'),
        ),
        undefined,
        [],
      ),
    )
  }

  protected getAdapterAssignmentStatementAst(): Statement {
    return factory.createExpressionStatement(
      factory.createBinaryExpression(
        factory.createElementAccessExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(
              this.context().localNameOf<ExpressContextRouterFactoryLocals>(undefined, this.name(), 'response'),
            ),
            factory.createIdentifier(ExpressFields.locals),
          ),
          factory.createStringLiteral(
            this.context().localNameOf<ExpressContextRouterFactoryLocals>(
              this.context().document(),
              this.name(),
              'adapterKey',
            ),
          ),
        ),
        factory.createToken(SyntaxKind.EqualsToken),
        factory.createIdentifier(
          this.context().localNameOf<ExpressContextRouterFactoryLocals>(undefined, this.name(), 'adapter'),
        ),
      ),
    )
  }

  protected getApiAssignmentStatementAst(): Statement {
    return factory.createExpressionStatement(
      factory.createBinaryExpression(
        factory.createElementAccessExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(
              this.context().localNameOf<ExpressContextRouterFactoryLocals>(undefined, this.name(), 'response'),
            ),
            factory.createIdentifier(ExpressFields.locals),
          ),
          factory.createStringLiteral(
            this.context().localNameOf<ExpressContextRouterFactoryLocals>(
              this.context().document(),
              this.name(),
              'apiKey',
            ),
          ),
        ),
        factory.createToken(SyntaxKind.EqualsToken),
        factory.createIdentifier(
          this.context().localNameOf<ExpressContextRouterFactoryLocals>(undefined, this.name(), 'api'),
        ),
      ),
    )
  }
}
