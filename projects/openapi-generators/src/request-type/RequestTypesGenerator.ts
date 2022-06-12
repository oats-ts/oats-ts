import { BaseCodeGenerator } from '@oats-ts/generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject } from '@oats-ts/openapi-model'
import { isNil, sortBy } from 'lodash'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  hasInput,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getRequestTypeAst } from '../utils/request/getRequestTypeAst'
import { requestPropertyFactory } from './requestPropertyFactory'
import { getCommonImports } from '../utils/request/getCommonImports'

export class RequestTypesGenerator extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  EnhancedOperation,
  OpenAPIGeneratorContext
> {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/request-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['json-schema/type', 'openapi/request-headers-type', 'openapi/query-type', 'openapi/path-type']
  }

  public runtimeDependencies(): string[] {
    return []
  }

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): EnhancedOperation[] {
    return sortBy(getEnhancedOperations(this.input.document, this.context), ({ operation }) =>
      this.context.nameOf(operation, 'openapi/operation'),
    ).filter((operation) => hasInput(operation, this.context))
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, 'openapi/request-type')
    const ast = getRequestTypeAst(
      this.context.nameOf(data.operation, 'openapi/request-type'),
      data,
      this.context,
      requestPropertyFactory,
    )
    return success(createSourceFile(path, getCommonImports(path, data, this.context), [ast]))
  }

  // private context: OpenAPIGeneratorContext = null
  // private operations: EnhancedOperation[]
  // public readonly id = 'openapi/request-type'
  // public readonly consumes: OpenAPIGeneratorTarget[] = [
  //   'json-schema/type',
  //   'openapi/request-headers-type',
  //   'openapi/query-type',
  //   'openapi/path-type',
  // ]
  // public readonly runtimeDepencencies: string[] = []
  // public initialize(
  //   data: OpenAPIReadOutput,
  //   config: GeneratorConfig,
  //   generators: CodeGenerator<OpenAPIReadOutput, TypeScriptModule>[],
  // ): void {
  //   this.context = createOpenAPIGeneratorContext(data, config, generators as OpenAPIGenerator[])
  //   const { document, nameOf } = this.context
  //   this.operations =
  // }
  //
  // public async generate(): Promise<Result<TypeScriptModule[]>> {
  //   const { context } = this
  //   const data: TypeScriptModule[] = mergeTypeScriptModules(
  //     flatMap(this.operations, (operation: EnhancedOperation): TypeScriptModule[] =>
  //       [generateRequestType(operation, context)].filter(negate(isNil)),
  //     ),
  //   )
  //   // TODO maybe try-catch?
  //   return {
  //     isOk: true,
  //     issues: [],
  //     data,
  //   }
  // }

  private enhance(input: OperationObject): EnhancedOperation {
    const operation = this.items.find(({ operation }) => operation === input)
    if (isNil(operation)) {
      throw new Error(`${JSON.stringify(input)} is not a registered operation.`)
    }
    return operation
  }

  public referenceOf(input: OperationObject): TypeNode | Expression {
    return hasInput(this.enhance(input), this.context)
      ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasInput(this.enhance(input), this.context)
      ? getModelImports(fromPath, this.id, [input], this.context)
      : undefined
  }
}
