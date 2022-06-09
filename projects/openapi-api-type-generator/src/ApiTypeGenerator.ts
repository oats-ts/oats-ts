import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { BaseCodeGenerator } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { factory, ImportDeclaration, SourceFile, TypeReferenceNode } from 'typescript'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { ApiTypeGeneratorConfig } from './typings'
import { ApiTypeGeneratorItem } from './internalTypings'
import { getApiTypeImports } from './getApiTypeImports'
import { getApiTypeAst } from './getApiTypeAst'

export class ApiTypeGenerator extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  ApiTypeGeneratorItem,
  OpenAPIGeneratorContext
> {
  public constructor(private readonly config: ApiTypeGeneratorConfig) {
    super()
  }

  public name(): OpenAPIGeneratorTarget {
    return 'openapi/api-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['openapi/request-server-type', 'openapi/response-type']
  }

  public runtimeDependencies(): string[] {
    return []
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
    return success(
      createSourceFile(
        this.context.pathOf(document, this.name()),
        getApiTypeImports(document, operations, this.context, true),
        [getApiTypeAst(document, operations, this.context, this.config)],
      ),
    )
  }

  public referenceOf(input: OpenAPIObject): TypeReferenceNode | undefined {
    const [{ operations }] = this.items
    return operations.length > 0 ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name())) : undefined
  }
  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [{ operations }] = this.items
    return operations.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
