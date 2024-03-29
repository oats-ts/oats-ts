import { ContentObject, OperationObject } from '@oats-ts/openapi-model'
import { entries, flatMap, isNil } from 'lodash'
import {
  EnhancedOperation,
  hasRequestBody,
  OpenAPIGeneratorTarget,
  getRequestBodyContent,
} from '@oats-ts/openapi-common'
import {
  Expression,
  TypeNode,
  ImportDeclaration,
  factory,
  SourceFile,
  PropertyAssignment,
  NodeFlags,
  SyntaxKind,
  Statement,
} from 'typescript'
import { createSourceFile, getModelImports, getNamedImports, getPropertyChain } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'

export class RequestBodyValidatorsGenerator extends OperationBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/request-body-validator'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type', 'oats/type-validator']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: this.validatorsPkg.name, version }]
  }

  protected shouldGenerate(data: EnhancedOperation): boolean {
    return hasRequestBody(data, this.context())
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context().pathOf(data.operation, this.name())
    return success(
      createSourceFile(path, this.getImportDeclarations(path, data), [this.getRequestBodyValidatorAst(data)]),
    )
  }

  protected getImportDeclarations(path: string, data: EnhancedOperation): ImportDeclaration[] {
    const content = entries(getRequestBodyContent(data, this.context())).map(
      ([contentType, { schema }]): [string, Referenceable<SchemaObject>] => [contentType, schema!],
    )
    const body = this.context().dereference(data.operation.requestBody)
    const needsOptional = !Boolean(body?.required)
    return [
      ...flatMap(content, ([, schema]) =>
        this.context().dependenciesOf<ImportDeclaration>(path, schema, 'oats/type-validator'),
      ),
      ...(needsOptional ? [getNamedImports(this.validatorsPkg.name, [this.validatorsPkg.imports.validators])] : []),
    ]
  }

  protected getRequestBodyValidatorAst(data: EnhancedOperation): Statement {
    const body = this.context().dereference(data.operation.requestBody)
    return factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            this.context().nameOf(data.operation, this.name()),
            undefined,
            undefined,
            factory.createAsExpression(
              factory.createObjectLiteralExpression(
                this.getContentTypeBasedValidatorsAst(
                  Boolean(body?.required),
                  getRequestBodyContent(data, this.context()),
                ),
              ),
              factory.createTypeReferenceNode('const'),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getContentTypeBasedValidatorsAst(required: boolean, content: ContentObject): PropertyAssignment[] {
    return entries(content || {}).map(([contentType, mediaTypeObj]) => {
      let validatorExpr: Expression = undefined!

      if (isNil(mediaTypeObj.schema)) {
        validatorExpr = factory.createCallExpression(
          getPropertyChain(factory.createIdentifier(this.validatorsPkg.exports.validators), [
            this.validatorsPkg.content.validators.any,
          ]),
          [],
          [],
        )
      } else {
        validatorExpr = this.context().referenceOf(mediaTypeObj.schema, 'oats/type-validator')
        if (!required) {
          validatorExpr = factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(this.validatorsPkg.exports.validators),
              this.validatorsPkg.content.validators.optional,
            ),
            [],
            [validatorExpr],
          )
        }
      }
      return factory.createPropertyAssignment(factory.createStringLiteral(contentType), validatorExpr)
    })
  }

  public referenceOf(input: OperationObject): TypeNode | Expression | undefined {
    return hasRequestBody(this.enhanced(input), this.context())
      ? factory.createIdentifier(this.context().nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasRequestBody(this.enhanced(input), this.context())
      ? getModelImports(fromPath, this.name(), [input], this.context())
      : []
  }
}
