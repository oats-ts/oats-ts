import { BaseCodeGenerator } from '@oats-ts/generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject } from '@oats-ts/openapi-model'
import { flatMap, sortBy } from 'lodash'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  hasResponses,
  OpenAPIGeneratorTarget,
  getEnhancedResponses,
} from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory, SourceFile } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getReturnTypeAst } from './getResponseTypeAst'

export class ResponseTypesGenerator extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  EnhancedOperation,
  OpenAPIGeneratorContext
> {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/response-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['json-schema/type', 'openapi/response-headers-type']
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
    ).filter(({ operation }) => hasResponses(operation, this.context))
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

  public referenceOf(input: OperationObject): TypeNode | Expression {
    return hasResponses(input, this.context)
      ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasResponses(input, this.context) ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }

  // private context: OpenAPIGeneratorContext = null
  // private operations: EnhancedOperation[]

  // public readonly id =
  // public readonly consumes: OpenAPIGeneratorTarget[] =
  // public readonly runtimeDepencencies: string[] = []

  // public initialize(
  //   data: OpenAPIReadOutput,
  //   config: GeneratorConfig,
  //   generators: CodeGenerator<OpenAPIReadOutput, TypeScriptModule>[],
  // ): void {
  //   this.context = createOpenAPIGeneratorContext(data, config, generators as OpenAPIGenerator[])
  //   const { document, nameOf } = this.context

  // }

  // public async generate(): Promise<Result<TypeScriptModule[]>> {
  //   const { context } = this

  //   const data: TypeScriptModule[] = mergeTypeScriptModules(
  //     flatMap(this.operations, (operation: EnhancedOperation): TypeScriptModule[] =>
  //       [generateOperationReturnType(operation, context)].filter(negate(isNil)),
  //     ),
  //   )

  //   // TODO maybe try-catch?
  //   return {
  //     isOk: true,
  //     issues: [],
  //     data,
  //   }
  // }
}
