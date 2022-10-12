import { EnhancedOperation, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import {
  TypeNode,
  Expression,
  factory,
  ImportDeclaration,
  SourceFile,
  Statement,
  SyntaxKind,
  NodeFlags,
  ParameterDeclaration,
} from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { RouterNames } from '../utils/RouterNames'

const RouterFactoryNames = {
  root: 'root',
  routers: 'routers',
  uniqueRouters: 'uniqueRouters',
  overrides: 'overrides',
  factories: 'factories',
  childRouter: 'childRouter',
  factory: 'factory',
}

export class ExpressAppRouterFactoryGenerator extends DocumentBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/express-app-router-factory'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/express-router-factory', 'oats/express-router-factories-type', 'oats/api-type']
  }
  public runtimeDependencies(): RuntimeDependency[] {
    return [
      { name: RuntimePackages.Http.name, version },
      { name: RuntimePackages.HttpServerExpress.name, version },
      { name: RuntimePackages.Express.name, version: '^4.18.1' },
    ]
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression | undefined {
    const [operations] = this.items
    return operations?.length > 0 ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [operations] = this.items
    return operations?.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }

  protected async generateItem(operations: EnhancedOperation[]): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(this.input.document, this.name())
    return success(
      createSourceFile(path, this.getImportDeclarations(path, operations), [this.getAppRouterFactoryAst(operations)]),
    )
  }

  protected getAppRouterFactoryAst(operations: EnhancedOperation[]) {
    return factory.createFunctionDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      undefined,
      factory.createIdentifier(this.context.nameOf(this.context.document, this.name())),
      undefined,
      this.getParametersAst(),
      factory.createTypeReferenceNode(factory.createIdentifier(RuntimePackages.Express.IRouter), undefined),
      factory.createBlock(
        [
          this.getRootRouterStatement(),
          this.getFactoriesArrayStatement(operations),
          this.getRouterCreationStatement(),
          this.getReturnStatement(),
        ],
        true,
      ),
    )
  }

  protected getImportDeclarations(path: string, operations: EnhancedOperation[]): ImportDeclaration[] {
    return [
      getNamedImports(RuntimePackages.Express.name, [RuntimePackages.Express.Router, RuntimePackages.Express.IRouter]),
      ...getModelImports<OpenAPIGeneratorTarget>(
        path,
        'oats/express-router-factories-type',
        [this.input.document],
        this.context,
      ),
      ...getModelImports<OpenAPIGeneratorTarget>(
        path,
        'oats/express-router-factory',
        operations.map(({ operation }) => operation),
        this.context,
      ),
    ]
  }

  protected getRootRouterStatement(): Statement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(RouterFactoryNames.root),
            undefined,
            undefined,
            factory.createBinaryExpression(
              factory.createIdentifier(RouterNames.router),
              factory.createToken(SyntaxKind.QuestionQuestionToken),
              factory.createCallExpression(factory.createIdentifier(RuntimePackages.Express.Router), undefined, []),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getFactoriesArrayStatement(operations: EnhancedOperation[]): Statement {
    const factoriesArrayAst = factory.createArrayLiteralExpression(
      operations.map(({ operation }) => {
        return factory.createBinaryExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(RouterFactoryNames.overrides),
            this.context.nameOf(operation, 'oats/express-router-factory'),
          ),
          factory.createToken(SyntaxKind.QuestionQuestionToken),
          this.context.referenceOf(operation, 'oats/express-router-factory'),
        )
      }),
    )
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(RouterFactoryNames.factories),
            undefined,
            undefined,
            factoriesArrayAst,
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getRouterCreationStatement(): Statement {
    return factory.createVariableStatement(
      undefined,
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(RouterFactoryNames.uniqueRouters),
            undefined,
            undefined,
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier(RouterFactoryNames.factories),
                    factory.createIdentifier('map'),
                  ),
                  undefined,
                  [
                    factory.createArrowFunction(
                      undefined,
                      undefined,
                      [
                        factory.createParameterDeclaration(
                          undefined,
                          undefined,
                          undefined,
                          factory.createIdentifier(RouterFactoryNames.factory),
                        ),
                      ],
                      undefined,
                      factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                      factory.createCallExpression(factory.createIdentifier(RouterFactoryNames.factory), undefined, [
                        factory.createIdentifier(RouterNames.router),
                      ]),
                    ),
                  ],
                ),
                factory.createIdentifier('filter'),
              ),
              undefined,
              [
                factory.createArrowFunction(
                  undefined,
                  undefined,
                  [
                    factory.createParameterDeclaration(
                      undefined,
                      undefined,
                      undefined,
                      factory.createIdentifier(RouterFactoryNames.childRouter),
                    ),
                  ],
                  undefined,
                  factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                  factory.createBinaryExpression(
                    factory.createIdentifier(RouterFactoryNames.childRouter),
                    factory.createToken(SyntaxKind.ExclamationEqualsEqualsToken),
                    factory.createIdentifier(RouterFactoryNames.root),
                  ),
                ),
              ],
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getReturnStatement(): Statement {
    return factory.createReturnStatement(
      factory.createConditionalExpression(
        factory.createBinaryExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(RouterFactoryNames.uniqueRouters),
            factory.createIdentifier('length'),
          ),
          factory.createToken(SyntaxKind.EqualsEqualsEqualsToken),
          factory.createNumericLiteral(0),
        ),
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createIdentifier(RouterFactoryNames.root),
        factory.createToken(SyntaxKind.ColonToken),
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier(RouterFactoryNames.root),
            factory.createIdentifier(RouterNames.use),
          ),
          undefined,
          [factory.createSpreadElement(factory.createIdentifier(RouterFactoryNames.uniqueRouters))],
        ),
      ),
    )
  }

  protected getParametersAst(): ParameterDeclaration[] {
    return [
      factory.createParameterDeclaration(
        [],
        [],
        undefined,
        factory.createIdentifier(RouterNames.router),
        factory.createToken(SyntaxKind.QuestionToken),
        factory.createUnionTypeNode([
          factory.createTypeReferenceNode(RuntimePackages.Express.IRouter, undefined),
          factory.createTypeReferenceNode('undefined', undefined),
        ]),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(RouterFactoryNames.overrides),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier('Partial'), [
          this.context.referenceOf(this.context.document, 'oats/express-router-factories-type'),
        ]),
        factory.createObjectLiteralExpression([], false),
      ),
    ]
  }
}
