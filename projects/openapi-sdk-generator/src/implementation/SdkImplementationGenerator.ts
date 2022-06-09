import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { flatMap, sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { SdkGeneratorConfig } from '../typings'
import { BaseCodeGenerator } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration, SourceFile } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { ApiTypeGeneratorItem } from '../internalTypings'
import { Try, success } from '@oats-ts/try'
import { getSdkTypeImports } from '../getSdkTypeImports'
import { getSdkClassAst } from './getSdkClassAst'

export class SdkImplementationGenerator extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  ApiTypeGeneratorItem,
  OpenAPIGeneratorContext
> {
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

  protected getItems(): ApiTypeGeneratorItem[] {
    const operations = sortBy(getEnhancedOperations(this.input.document, this.context), ({ operation }) =>
      this.context.nameOf(operation, 'openapi/operation'),
    )

    return operations.length > 0
      ? [
          {
            document: this.input.document,
            operations,
          },
        ]
      : []
  }

  public async generateItem({ document, operations }: ApiTypeGeneratorItem): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(document, 'openapi/sdk-impl')
    return success(
      createSourceFile(
        path,
        [
          getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.ClientAdapter]),
          ...getSdkTypeImports(document, operations, this.context, true),
          ...this.context.dependenciesOf(path, document, 'openapi/sdk-type'),
          ...flatMap(operations, ({ operation }) => this.context.dependenciesOf(path, operation, 'openapi/operation')),
        ],
        [getSdkClassAst(document, operations, this.context, this.config)],
      ),
    )
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression {
    const [{ operations }] = this.items
    return operations.length > 0 ? factory.createIdentifier(this.context.nameOf(input, this.name())) : undefined
  }
  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [{ operations }] = this.items
    return operations.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
