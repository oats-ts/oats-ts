import { OperationObject } from '@oats-ts/openapi-model'
import { flatMap } from 'lodash'
import { EnhancedOperation, hasResponses, OpenAPIGeneratorTarget, getEnhancedResponses } from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { RuntimePackages } from '@oats-ts/model-common'
import { success, Try } from '@oats-ts/try'
import { getResponseBodyValidatorAst } from './getResponseBodyValidatorAst'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'

export class ResponseBodyValidatorsGenerator extends OperationBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/response-body-validator'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['json-schema/type', 'json-schema/type-validator']
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.Validators.name]
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, 'openapi/response-body-validator')
    const responses = getEnhancedResponses(data.operation, this.context)
    const dependencies = [
      ...flatMap(responses, ({ schema }) => this.context.dependenciesOf(path, schema, 'json-schema/type-validator')),
    ]
    return success(createSourceFile(path, dependencies, [getResponseBodyValidatorAst(data, this.context)]))
  }

  public referenceOf(input: OperationObject): TypeNode | Expression | undefined {
    return hasResponses(input, this.context)
      ? factory.createIdentifier(this.context.nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasResponses(input, this.context) ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
