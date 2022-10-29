import { ContentObject, OperationObject } from '@oats-ts/openapi-model'
import { entries, flatMap } from 'lodash'
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
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { packages } from '@oats-ts/model-common'

export class RequestBodyValidatorsGenerator extends OperationBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/request-body-validator'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type', 'oats/type-validator']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: packages.validators.name, version }]
  }

  protected shouldGenerate(data: EnhancedOperation): boolean {
    return hasRequestBody(data, this.context)
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, this.name())
    return success(
      createSourceFile(path, this.getImportDeclarations(path, data), [this.getRequestBodyValidatorAst(data)]),
    )
  }

  protected getImportDeclarations(path: string, data: EnhancedOperation): ImportDeclaration[] {
    const content = entries(getRequestBodyContent(data, this.context)).map(
      ([contentType, { schema }]): [string, Referenceable<SchemaObject>] => [contentType, schema!],
    )
    const body = this.context.dereference(data.operation.requestBody)
    const needsOptional = !Boolean(body?.required)
    return [
      ...flatMap(content, ([, schema]) => this.context.dependenciesOf(path, schema, 'oats/type-validator')),
      ...(needsOptional ? [getNamedImports(packages.validators.name, [packages.validators.exports.validators])] : []),
    ]
  }

  protected getRequestBodyValidatorAst(data: EnhancedOperation): Statement {
    const body = this.context.dereference(data.operation.requestBody)
    return factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            this.context.nameOf(data.operation, this.name()),
            undefined,
            undefined,
            factory.createAsExpression(
              factory.createObjectLiteralExpression(
                this.getContentTypeBasedValidatorsAst(
                  Boolean(body?.required),
                  getRequestBodyContent(data, this.context),
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
      const expression: Expression = this.context.referenceOf(mediaTypeObj.schema, 'oats/type-validator')
      const validatorExpr = required
        ? expression
        : factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier(packages.validators.exports.validators),
              packages.validators.content.validators.optional,
            ),
            [],
            [expression],
          )
      return factory.createPropertyAssignment(factory.createStringLiteral(contentType), validatorExpr)
    })
  }

  public referenceOf(input: OperationObject): TypeNode | Expression | undefined {
    const { context } = this
    return hasRequestBody(this.enhanced(input), context)
      ? factory.createIdentifier(context.nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasRequestBody(this.enhanced(input), this.context)
      ? getModelImports(fromPath, this.name(), [input], this.context)
      : []
  }
}
