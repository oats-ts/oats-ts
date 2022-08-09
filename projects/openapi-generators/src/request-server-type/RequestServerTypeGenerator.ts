import { OperationObject } from '@oats-ts/openapi-model'
import { isNil } from 'lodash'
import { EnhancedOperation, hasInput, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getRequestTypeAst } from '../utils/request/getRequestTypeAst'
import { serverRequestPropertyFactory } from './serverRequestPropertyFactory'
import { getCommonImports } from '../utils/request/getCommonImports'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'

export class RequestServerTypesGenerator extends OperationBasedCodeGenerator<{}> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/request-server-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/type', 'oats/request-headers-type', 'oats/query-type', 'oats/path-type']
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.Try.name]
  }

  protected shouldGenerate(operation: EnhancedOperation): boolean {
    return hasInput(operation, this.context)
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, this.name())
    const ast = getRequestTypeAst(
      this.context.nameOf(data.operation, this.name()),
      data,
      this.context,
      serverRequestPropertyFactory,
    )
    return success(
      createSourceFile(
        path,
        [
          getNamedImports(RuntimePackages.Try.name, [RuntimePackages.Try.Try]),
          ...getCommonImports(path, data, this.context),
        ],
        isNil(ast) ? [] : [ast],
      ),
    )
  }

  public referenceOf(input: OperationObject): TypeNode | Expression | undefined {
    return hasInput(this.enhanced(input), this.context)
      ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasInput(this.enhanced(input), this.context)
      ? getModelImports(fromPath, this.name(), [input], this.context)
      : []
  }
}
