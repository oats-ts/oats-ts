import { OperationObject } from '@oats-ts/openapi-model'
import { flatMap } from 'lodash'
import { EnhancedOperation, hasResponses, OpenAPIGeneratorTarget, getEnhancedResponses } from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getReturnTypeAst } from './getResponseTypeAst'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'

export class ResponseTypesGenerator extends OperationBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/response-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['json-schema/type', 'openapi/response-headers-type']
  }

  public runtimeDependencies(): string[] {
    return []
  }

  protected shouldGenerate({ operation }: EnhancedOperation): boolean {
    return hasResponses(operation, this.context)
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const responses = getEnhancedResponses(data.operation, this.context)
    const path = this.context.pathOf(data.operation, this.name())
    return success(
      createSourceFile(
        path,
        [
          ...flatMap(responses, ({ schema, statusCode }) => [
            ...this.context.dependenciesOf(path, schema, 'json-schema/type'),
            ...this.context.dependenciesOf(path, [data.operation, statusCode], 'openapi/response-headers-type'),
          ]),
        ],
        [getReturnTypeAst(data, this.context)],
      ),
    )
  }

  public referenceOf(input: OperationObject): TypeNode | Expression | undefined {
    return hasResponses(input, this.context)
      ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasResponses(input, this.context) ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
