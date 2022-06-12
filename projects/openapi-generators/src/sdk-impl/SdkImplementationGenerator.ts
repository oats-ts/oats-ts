import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { flatMap, sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  RuntimePackages,
  EnhancedOperation,
} from '@oats-ts/openapi-common'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { BaseCodeGenerator } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration, SourceFile } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { ApiTypeGeneratorItem } from '../utils/sdk/internalTypings'
import { Try, success } from '@oats-ts/try'
import { getSdkTypeImports } from '../utils/sdk/getSdkTypeImports'
import { getSdkClassAst } from './getSdkClassAst'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'

export class SdkImplementationGenerator extends DocumentBasedCodeGenerator {
  public constructor(private readonly config: SdkGeneratorConfig) {
    super()
  }

  public name(): OpenAPIGeneratorTarget {
    return 'openapi/sdk-impl'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['openapi/operation', 'openapi/request-type', 'openapi/response-type', 'openapi/sdk-type']
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.Http.name]
  }

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(this.input, this.globalConfig, this.dependencies)
  }

  protected itemFilter(operations: EnhancedOperation[]): boolean {
    return operations.length > 0
  }

  public async generateItem(operations: EnhancedOperation[]): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(this.input.document, this.name())
    return success(
      createSourceFile(
        path,
        [
          getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.ClientAdapter]),
          ...getSdkTypeImports(this.input.document, operations, this.context, true),
          ...this.context.dependenciesOf(path, this.input.document, 'openapi/sdk-type'),
          ...flatMap(operations, ({ operation }) => this.context.dependenciesOf(path, operation, 'openapi/operation')),
        ],
        [getSdkClassAst(this.input.document, operations, this.context, this.config)],
      ),
    )
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression {
    const [operations] = this.items
    return operations.length > 0 ? factory.createIdentifier(this.context.nameOf(input, this.name())) : undefined
  }
  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [operations] = this.items
    return operations.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
