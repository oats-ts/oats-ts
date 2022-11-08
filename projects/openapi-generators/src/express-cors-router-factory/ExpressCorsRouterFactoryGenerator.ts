import { EnhancedPathItem, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import {
  Block,
  Expression,
  factory,
  Identifier,
  ImportDeclaration,
  NodeFlags,
  ParameterDeclaration,
  SourceFile,
  Statement,
  SyntaxKind,
} from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { PathBasedCodeGenerator } from '../utils/PathBasedCodeGenerator'
import { isNil } from 'lodash'
import { getPathTemplate } from '../utils/getPathTemplate'
import { RawResponseFields, ServerAdapterMethods } from '../utils/OatsApiNames'
import { LocalNameDefaults } from '@oats-ts/model-common'
import { ExpressCorsRouterFactoryDefaultLocals } from './ExpressCorsRouterFactoryDefaultLocals'
import { ExpressCorsRouterFactoryLocals } from './typings'

export class ExpressCorsRouterFactoryGenerator extends PathBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/express-cors-router-factory'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/cors-configuration']
  }

  protected getDefaultLocals(): LocalNameDefaults {
    return ExpressCorsRouterFactoryDefaultLocals
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [
      { name: this.httpPkg.name, version },
      { name: this.adapterPkg.name, version },
      { name: this.expressPkg.name, version: '^4.18.1' },
    ]
  }

  public referenceOf(input: OpenAPIObject): Identifier | undefined {
    const [paths] = this.items
    return paths?.length > 0 ? factory.createIdentifier(this.context().nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: any): ImportDeclaration[] {
    const [paths] = this.items
    return paths?.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context()) : []
  }

  public async generateItem(paths: EnhancedPathItem[]): Promise<Try<SourceFile>> {
    const path = this.context().pathOf(this.input.document, this.name())
    return success(
      createSourceFile(path, this.getImportDeclarations(path), [this.getCorsRouterFactoryStatement(paths)]),
    )
  }

  protected getCorsRouterFactoryStatement(paths: EnhancedPathItem[]): Statement {
    return factory.createFunctionDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      undefined,
      factory.createIdentifier(this.context().nameOf(this.context().document(), this.name())),
      undefined,
      [
        factory.createParameterDeclaration(
          [],
          [],
          undefined,
          this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'router'),
          factory.createToken(SyntaxKind.QuestionToken),
          factory.createUnionTypeNode([
            factory.createTypeReferenceNode(this.expressPkg.exports.IRouter, undefined),
            factory.createTypeReferenceNode('undefined', undefined),
          ]),
        ),
      ],
      factory.createTypeReferenceNode(factory.createIdentifier(this.expressPkg.exports.IRouter), undefined),
      factory.createBlock([factory.createReturnStatement(this.getCorsRouterExpression(paths))], true),
    )
  }

  protected getCorsRouterExpression(paths: EnhancedPathItem[]): Expression {
    const routerExpr: Expression = factory.createBinaryExpression(
      factory.createIdentifier(
        this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'router'),
      ),
      SyntaxKind.QuestionQuestionToken,
      factory.createCallExpression(factory.createIdentifier(this.expressPkg.exports.Router), [], []),
    )
    return Array.from(paths)
      .reverse()
      .reduce((prevExpr: Expression, pathItem: EnhancedPathItem) => {
        return factory.createCallExpression(
          factory.createPropertyAccessExpression(prevExpr, 'options'),
          [],
          [factory.createStringLiteral(getPathTemplate(pathItem.url)), this.getCorsHandlerArrowFunction(pathItem)],
        )
      }, routerExpr)
  }

  protected getCorsHandlerArrowFunction(data: EnhancedPathItem): Expression {
    return factory.createArrowFunction(
      [factory.createModifier(SyntaxKind.AsyncKeyword)],
      undefined,
      this.getCorsHandlerArrowFunctionParameters(),
      undefined,
      factory.createToken(SyntaxKind.EqualsGreaterThanToken),
      this.getCorsHandlerBodyBlock(data),
    )
  }

  protected getCorsHandlerArrowFunctionParameters(): ParameterDeclaration[] {
    return [
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'request'),
        undefined,
        factory.createTypeReferenceNode(this.expressPkg.exports.Request),
      ),
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'response'),
        undefined,
        factory.createTypeReferenceNode(this.expressPkg.exports.Response),
      ),
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'next'),
        undefined,
        factory.createTypeReferenceNode(this.expressPkg.exports.NextFunction),
      ),
    ]
  }

  protected getCorsHandlerBodyBlock(data: EnhancedPathItem): Block {
    return factory.createBlock(
      [this.getToolkitStatement(data), this.getAdapterStatement(data), this.getTryCatchStatement(data)],
      true,
    )
  }

  private getTryCatchStatement(data: EnhancedPathItem): Statement {
    const tryBlock = factory.createBlock([
      this.getRequestedMethodStatement(),
      this.getCorsConfigStatement(data),
      this.getCorsMethodsStatement(),
      this.getRespondStatement(),
    ])
    return factory.createTryStatement(
      tryBlock,
      factory.createCatchClause(
        factory.createVariableDeclaration(
          factory.createIdentifier(
            this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'error'),
          ),
          undefined,
          undefined,
          undefined,
        ),
        factory.createBlock(
          [
            factory.createExpressionStatement(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ServerAdapterMethods.handleError),
                ),
                undefined,
                [
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'toolkit'),
                  ),
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'error'),
                  ),
                ],
              ),
            ),
          ],
          true,
        ),
      ),
      undefined,
    )
  }

  protected getToolkitStatement(data: EnhancedPathItem): Statement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'toolkit'),
            ),
            undefined,
            factory.createTypeReferenceNode(
              factory.createIdentifier(this.adapterPkg.exports.ExpressToolkit),
              undefined,
            ),
            factory.createObjectLiteralExpression(
              [
                factory.createShorthandPropertyAssignment(
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'request'),
                  ),
                  undefined,
                ),
                factory.createShorthandPropertyAssignment(
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'response'),
                  ),
                  undefined,
                ),
                factory.createShorthandPropertyAssignment(
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'next'),
                  ),
                  undefined,
                ),
              ],
              false,
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getAdapterStatement(data: EnhancedPathItem): Statement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'adapter'),
            ),
            undefined,
            factory.createTypeReferenceNode(factory.createIdentifier(this.httpPkg.exports.ServerAdapter), [
              factory.createTypeReferenceNode(
                factory.createIdentifier(this.adapterPkg.exports.ExpressToolkit),
                undefined,
              ),
            ]),
            factory.createElementAccessExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(
                  this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'response'),
                ),
                factory.createIdentifier(
                  this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'locals'),
                ),
              ),
              factory.createStringLiteral(
                this.context().localNameOf<ExpressCorsRouterFactoryLocals>(
                  this.context().document(),
                  this.name(),
                  'adapterKey',
                ),
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getRespondStatement() {
    return factory.createExpressionStatement(
      factory.createAwaitExpression(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(
              this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'adapter'),
            ),
            factory.createIdentifier(ServerAdapterMethods.respond),
          ),
          undefined,
          [
            factory.createIdentifier(
              this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'toolkit'),
            ),
            factory.createObjectLiteralExpression([
              factory.createPropertyAssignment(
                RawResponseFields.headers,
                factory.createIdentifier(
                  this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'corsHeaders'),
                ),
              ),
            ]),
          ],
        ),
      ),
    )
  }

  protected getCorsMethodsStatement() {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'corsHeaders'),
            ),
            undefined,
            undefined,
            factory.createAwaitExpression(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'adapter'),
                  ),
                  factory.createIdentifier(ServerAdapterMethods.getPreflightCorsHeaders),
                ),
                undefined,
                [
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'toolkit'),
                  ),
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'method'),
                  ),
                  factory.createIdentifier(
                    this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'corsConfig'),
                  ),
                ],
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getCorsConfigStatement(data: EnhancedPathItem) {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'corsConfig'),
            ),
            undefined,
            undefined,
            factory.createConditionalExpression(
              factory.createBinaryExpression(
                factory.createIdentifier(
                  this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'method'),
                ),
                factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
                factory.createIdentifier('undefined'),
              ),
              factory.createToken(SyntaxKind.QuestionToken),
              factory.createIdentifier('undefined'),
              factory.createToken(SyntaxKind.ColonToken),
              factory.createElementAccessChain(
                factory.createElementAccessChain(
                  this.context().referenceOf(this.context().document(), 'oats/cors-configuration'),
                  factory.createToken(SyntaxKind.QuestionDotToken),
                  factory.createStringLiteral(data.url),
                ),
                factory.createToken(SyntaxKind.QuestionDotToken),
                factory.createIdentifier(
                  this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'method'),
                ),
              ),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getRequestedMethodStatement() {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(
              this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'method'),
            ),
            undefined,
            undefined,
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier(
                  this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'adapter'),
                ),
                factory.createIdentifier(ServerAdapterMethods.getAccessControlRequestedMethod),
              ),
              undefined,
              [
                factory.createIdentifier(
                  this.context().localNameOf<ExpressCorsRouterFactoryLocals>(undefined, this.name(), 'toolkit'),
                ),
              ],
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getImportDeclarations(path: string): ImportDeclaration[] {
    const paths = this.items[0]

    if (isNil(paths) || paths.length === 0) {
      return [getNamedImports(this.expressPkg.name, [this.expressPkg.imports.IRouter, this.expressPkg.imports.Router])]
    }
    return [
      getNamedImports(this.expressPkg.name, [
        this.expressPkg.imports.IRouter,
        this.expressPkg.imports.Router,
        this.expressPkg.imports.Request,
        this.expressPkg.imports.Response,
        this.expressPkg.imports.NextFunction,
      ]),
      getNamedImports(this.httpPkg.name, [this.httpPkg.imports.ServerAdapter]),
      getNamedImports(this.adapterPkg.name, [this.adapterPkg.imports.ExpressToolkit]),
      ...getModelImports<OpenAPIGeneratorTarget>(
        path,
        'oats/cors-configuration',
        [this.context().document()],
        this.context(),
      ),
    ]
  }
}
