import { OperationObject } from '@oats-ts/openapi-model'
import { OperationsGeneratorConfig } from './typings'
import { EnhancedOperation, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getOperationFunctionAst } from './getOperationFunctionAst'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'

export class OperationsGenerator extends OperationBasedCodeGenerator<OperationsGeneratorConfig> {
  name(): OpenAPIGeneratorTarget {
    return 'oats/operation'
  }

  consumes(): OpenAPIGeneratorTarget[] {
    const validatorDep: OpenAPIGeneratorTarget[] = ['oats/response-body-validator']
    return [
      'oats/type',
      'oats/request-headers-type',
      'oats/query-type',
      'oats/path-type',
      'oats/response-type',
      'oats/request-type',
      'oats/request-headers-serializer',
      'oats/path-serializer',
      'oats/query-serializer',
      'oats/response-headers-deserializer',
      'oats/cookie-serializer',
      'oats/set-cookie-deserializer',
      'oats/cookies-type',
      ...(this.configuration().validate ? validatorDep : []),
    ]
  }

  runtimeDependencies(): RuntimeDependency[] {
    return [
      { name: RuntimePackages.Http.name, version },
      /* Adding this as runtime package as otherwise it's undiscoverable */
      { name: '@oats-ts/openapi-fetch-client-adapter', version },
    ]
  }

  protected async generateItem(item: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(item.operation, 'oats/operation')
    return success(
      createSourceFile(
        path,
        [
          getNamedImports(RuntimePackages.Http.name, [
            RuntimePackages.Http.RawHttpRequest,
            RuntimePackages.Http.ClientAdapter,
          ]),
          ...this.context.dependenciesOf(path, item.operation, 'oats/request-type'),
          ...this.context.dependenciesOf(path, item.operation, 'oats/response-type'),
          ...this.context.dependenciesOf(path, item.operation, 'oats/path-serializer'),
          ...this.context.dependenciesOf(path, item.operation, 'oats/query-serializer'),
          ...this.context.dependenciesOf(path, item.operation, 'oats/request-headers-serializer'),
          ...this.context.dependenciesOf(path, item.operation, 'oats/response-headers-deserializer'),
          ...(this.configuration().validate
            ? this.context.dependenciesOf(path, item.operation, 'oats/response-body-validator')
            : []),
        ],
        [getOperationFunctionAst(item, this.context, this.configuration())],
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
