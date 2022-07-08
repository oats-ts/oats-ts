import { OperationObject } from '@oats-ts/openapi-model'
import { OperationsGeneratorConfig } from './typings'
import { EnhancedOperation, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getOperationFunctionAst } from './getOperationFunctionAst'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'

export class OperationsGenerator extends OperationBasedCodeGenerator<OperationsGeneratorConfig> {
  name(): OpenAPIGeneratorTarget {
    return 'openapi/operation'
  }

  consumes(): OpenAPIGeneratorTarget[] {
    const validatorDep: OpenAPIGeneratorTarget[] = ['openapi/response-body-validator']
    return [
      'json-schema/type',
      'openapi/request-headers-type',
      'openapi/query-type',
      'openapi/path-type',
      'openapi/response-type',
      'openapi/request-type',
      'openapi/request-headers-serializer',
      'openapi/path-serializer',
      'openapi/query-serializer',
      'openapi/response-headers-deserializer',
      ...(this.config.validate ? validatorDep : []),
    ]
  }

  runtimeDependencies(): string[] {
    return [
      RuntimePackages.Http.name,
      /* Adding this as runtime package as otherwise it's undiscoverable */
      '@oats-ts/openapi-fetch-client-adapter',
    ]
  }

  protected async generateItem(item: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(item.operation, 'openapi/operation')
    return success(
      createSourceFile(
        path,
        [
          getNamedImports(RuntimePackages.Http.name, [
            RuntimePackages.Http.RawHttpRequest,
            RuntimePackages.Http.ClientAdapter,
          ]),
          ...this.context.dependenciesOf(path, item.operation, 'openapi/request-type'),
          ...this.context.dependenciesOf(path, item.operation, 'openapi/response-type'),
          ...this.context.dependenciesOf(path, item.operation, 'openapi/path-serializer'),
          ...this.context.dependenciesOf(path, item.operation, 'openapi/query-serializer'),
          ...this.context.dependenciesOf(path, item.operation, 'openapi/request-headers-serializer'),
          ...this.context.dependenciesOf(path, item.operation, 'openapi/response-headers-deserializer'),
          ...(this.config.validate
            ? this.context.dependenciesOf(path, item.operation, 'openapi/response-body-validator')
            : []),
        ],
        [getOperationFunctionAst(item, this.context, this.config)],
      ),
    )
  }

  public referenceOf(input: OperationObject): TypeNode | Expression {
    return factory.createIdentifier(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return getModelImports(fromPath, this.name(), [input], this.context)
  }
}
