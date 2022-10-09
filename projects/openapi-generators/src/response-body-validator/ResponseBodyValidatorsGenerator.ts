import { ContentObject, OperationObject } from '@oats-ts/openapi-model'
import { entries, flatMap, isNil } from 'lodash'
import { EnhancedOperation, hasResponses, OpenAPIGeneratorTarget, getEnhancedResponses } from '@oats-ts/openapi-common'
import {
  Expression,
  TypeNode,
  ImportDeclaration,
  factory,
  SourceFile,
  SyntaxKind,
  Statement,
  NodeFlags,
  PropertyAssignment,
} from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { RuntimePackages } from '@oats-ts/model-common'
import { success, Try } from '@oats-ts/try'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'

export class ResponseBodyValidatorsGenerator extends OperationBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/response-body-validator'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type', 'oats/type-validator']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: RuntimePackages.Validators.name, version }]
  }

  public referenceOf(input: OperationObject): TypeNode | Expression | undefined {
    return hasResponses(input, this.context)
      ? factory.createIdentifier(this.context.nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasResponses(input, this.context) ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, 'oats/response-body-validator')
    return success(
      createSourceFile(path, this.getImportDeclarations(path, data), [this.getResponseBodyValidatorAst(data)]),
    )
  }

  protected getImportDeclarations(path: string, data: EnhancedOperation): ImportDeclaration[] {
    return [
      ...flatMap(getEnhancedResponses(data.operation, this.context), ({ schema }) =>
        this.context.dependenciesOf(path, schema, 'oats/type-validator'),
      ),
    ]
  }

  protected getResponseBodyValidatorAst(data: EnhancedOperation): Statement {
    return factory.createVariableStatement(
      [factory.createModifier(SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            this.context.nameOf(data.operation, this.name()),
            undefined,
            undefined,
            factory.createAsExpression(
              factory.createObjectLiteralExpression(this.getResponseBodyValidatorPropertiesAst(data)),
              factory.createTypeReferenceNode('const'),
            ),
          ),
        ],
        NodeFlags.Const,
      ),
    )
  }

  protected getResponseBodyValidatorPropertiesAst(data: EnhancedOperation): PropertyAssignment[] {
    const { operation } = data
    const { default: defaultResponse, ...responses } = operation.responses || {}
    const properties: PropertyAssignment[] = entries(responses).map(
      ([statusCode, response]): PropertyAssignment =>
        factory.createPropertyAssignment(
          factory.createNumericLiteral(Number(statusCode)),
          factory.createObjectLiteralExpression(
            this.getContentTypeBasedValidatorsAst(true, this.context.dereference(response)?.content || {}),
          ),
        ),
    )
    if (!isNil(defaultResponse)) {
      properties.push(
        factory.createPropertyAssignment(
          'default',
          factory.createObjectLiteralExpression(
            this.getContentTypeBasedValidatorsAst(true, this.context.dereference(defaultResponse).content || {}),
          ),
        ),
      )
    }
    return properties
  }

  protected getContentTypeBasedValidatorsAst(required: boolean, content: ContentObject): PropertyAssignment[] {
    return entries(content || {}).map(([contentType, mediaTypeObj]) => {
      const expression: Expression = this.context.referenceOf(mediaTypeObj.schema, 'oats/type-validator')
      const validatorExpr = required
        ? expression
        : factory.createCallExpression(factory.createIdentifier(RuntimePackages.Validators.optional), [], [expression])
      return factory.createPropertyAssignment(factory.createStringLiteral(contentType), validatorExpr)
    })
  }
}
