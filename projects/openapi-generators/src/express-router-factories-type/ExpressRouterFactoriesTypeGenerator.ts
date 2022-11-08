import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration, SourceFile, SyntaxKind, Statement } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'
import { RuntimeDependency } from '@oats-ts/oats-ts'
import { LocalNameDefaults } from '@oats-ts/model-common'
import { ExpressRouterFactoriesTypeDefaultLocals } from './ExpressRouterFactoriesTypeDefaultLocals'
import { ExpressRouterFactoriesTypeLocals } from './typings'

export class ExpressRouterFactoriesTypeGenerator extends DocumentBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/express-router-factories-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/express-router-factory']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: this.expressPkg.name, version: '^4.18.1' }]
  }

  protected getDefaultLocals(): LocalNameDefaults {
    return ExpressRouterFactoriesTypeDefaultLocals
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

  protected async generateItem(operations: EnhancedOperation[]): Promise<Try<SourceFile>> {
    return success(
      createSourceFile(
        this.context().pathOf(this.input.document, this.name()),
        [getNamedImports(this.expressPkg.name, [this.expressPkg.imports.IRouter])],
        [this.getRouterFactoriesTypeStatement(operations)],
      ),
    )
  }

  getRouterFactoriesTypeStatement(operations: EnhancedOperation[]): Statement {
    return factory.createTypeAliasDeclaration(
      undefined,
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      this.context().nameOf(this.context().document(), this.name()),
      undefined,
      factory.createTypeLiteralNode(
        operations.map((operation) => {
          const fieldType = factory.createFunctionTypeNode(
            undefined,
            [
              factory.createParameterDeclaration(
                [],
                [],
                undefined,
                factory.createIdentifier(
                  this.context().localNameOf<ExpressRouterFactoriesTypeLocals>(undefined, this.name(), 'router'),
                ),
                factory.createToken(SyntaxKind.QuestionToken),
                factory.createUnionTypeNode([
                  factory.createTypeReferenceNode(this.expressPkg.exports.IRouter, undefined),
                  factory.createTypeReferenceNode('undefined', undefined),
                ]),
                undefined,
              ),
            ],
            factory.createTypeReferenceNode(this.expressPkg.exports.IRouter, undefined),
          )
          return factory.createPropertySignature(
            undefined,
            this.context().nameOf(operation.operation, 'oats/express-router-factory'),
            undefined,
            fieldType,
          )
        }),
      ),
    )
  }
}
