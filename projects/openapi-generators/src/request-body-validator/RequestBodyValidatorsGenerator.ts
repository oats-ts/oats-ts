import { OperationObject } from '@oats-ts/openapi-model'
import { entries, flatMap, isNil } from 'lodash'
import {
  EnhancedOperation,
  hasRequestBody,
  OpenAPIGeneratorTarget,
  getRequestBodyContent,
} from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { RuntimePackages } from '@oats-ts/model-common'
import { success, Try } from '@oats-ts/try'
import { Referenceable, SchemaObject } from '@oats-ts/json-schema-model'
import { getRequestBodyValidatorAst } from './getRequestBodyValidatorAst'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'

export class RequestBodyValidatorsGenerator extends OperationBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/request-body-validator'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['json-schema/type', 'json-schema/type-validator']
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.Validators.name]
  }

  protected itemFilter(data: EnhancedOperation): boolean {
    return entries(getRequestBodyContent(data, this.context)).length > 0
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, 'openapi/request-body-validator')
    const content = entries(getRequestBodyContent(data, this.context)).map(
      ([contentType, { schema }]): [string, Referenceable<SchemaObject>] => [contentType, schema!],
    )
    const body = this.context.dereference(data.operation.requestBody)
    const needsOptional = !Boolean(body?.required)
    const dependencies = [
      ...flatMap(content, ([, schema]) => this.context.dependenciesOf(path, schema, 'json-schema/type-validator')),
      ...(needsOptional
        ? [getNamedImports(RuntimePackages.Validators.name, [RuntimePackages.Validators.optional])]
        : []),
    ]
    return success(createSourceFile(path, dependencies, [getRequestBodyValidatorAst(data, this.context)]))
  }

  private enhance(input: OperationObject): EnhancedOperation {
    const operation = this.items.find(({ operation }) => operation === input)
    if (isNil(operation)) {
      throw new Error(`${JSON.stringify(input)} is not a registered operation.`)
    }
    return operation
  }

  public referenceOf(input: OperationObject): TypeNode | Expression | undefined {
    const { context } = this
    const { nameOf } = context
    return hasRequestBody(this.enhance(input), context)
      ? factory.createIdentifier(nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasRequestBody(this.enhance(input), this.context)
      ? getModelImports(fromPath, this.name(), [input], this.context)
      : []
  }
}
