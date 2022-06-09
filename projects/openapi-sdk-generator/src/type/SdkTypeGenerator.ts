import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { SdkGeneratorConfig } from '../typings'
import { BaseCodeGenerator } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration, SourceFile } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { ApiTypeGeneratorItem } from '../internalTypings'
import { success, Try } from '@oats-ts/try'
import { getSdkTypeImports } from '../getSdkTypeImports'
import { getSdkTypeAst } from './getSdkTypeAst'

export class SdkTypeGenerator extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  ApiTypeGeneratorItem,
  OpenAPIGeneratorContext
> {
  public constructor(private readonly config: SdkGeneratorConfig) {
    super()
  }

  public name(): OpenAPIGeneratorTarget {
    return 'openapi/sdk-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['openapi/operation', 'openapi/request-type', 'openapi/response-type']
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
        this.context.pathOf(document, 'openapi/sdk-type'),
        getSdkTypeImports(document, operations, this.context, true),
        [getSdkTypeAst(document, operations, this.context, this.config)],
      ),
    )
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression {
    const [{ operations }] = this.items
    return operations.length > 0 ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [{ operations }] = this.items
    return operations.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
