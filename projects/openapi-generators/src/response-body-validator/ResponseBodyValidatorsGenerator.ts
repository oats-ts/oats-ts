import { OperationObject } from '@oats-ts/openapi-model'
import { flatMap } from 'lodash'
import { EnhancedOperation, hasResponses, OpenAPIGeneratorTarget, getEnhancedResponses } from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { RuntimePackages } from '@oats-ts/model-common'
import { success, Try } from '@oats-ts/try'
import { getResponseBodyValidatorAst } from './getResponseBodyValidatorAst'
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

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, 'oats/response-body-validator')
    const responses = getEnhancedResponses(data.operation, this.context)
    const dependencies = [
      ...flatMap(responses, ({ schema }) => this.context.dependenciesOf(path, schema, 'oats/type-validator')),
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
