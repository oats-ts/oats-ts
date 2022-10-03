import { OperationObject } from '@oats-ts/openapi-model'
import { entries, flatMap } from 'lodash'
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
import { RuntimeDependency, version } from '@oats-ts/oats-ts'

export class RequestBodyValidatorsGenerator extends OperationBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/request-body-validator'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type', 'oats/type-validator']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: RuntimePackages.Validators.name, version }]
  }

  protected shouldGenerate(data: EnhancedOperation): boolean {
    return hasRequestBody(data, this.context)
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, this.name())
    const content = entries(getRequestBodyContent(data, this.context)).map(
      ([contentType, { schema }]): [string, Referenceable<SchemaObject>] => [contentType, schema!],
    )
    const body = this.context.dereference(data.operation.requestBody)
    const needsOptional = !Boolean(body?.required)
    const dependencies = [
      ...flatMap(content, ([, schema]) => this.context.dependenciesOf(path, schema, 'oats/type-validator')),
      ...(needsOptional
        ? [getNamedImports(RuntimePackages.Validators.name, [RuntimePackages.Validators.optional])]
        : []),
    ]
    return success(createSourceFile(path, dependencies, [getRequestBodyValidatorAst(data, this.context)]))
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
