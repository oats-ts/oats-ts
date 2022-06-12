import {
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  EnhancedOperation,
} from '@oats-ts/openapi-common'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration, SourceFile } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getSdkTypeImports } from '../utils/sdk/getSdkTypeImports'
import { getSdkTypeAst } from './getSdkTypeAst'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'

export class SdkTypeGenerator extends DocumentBasedCodeGenerator {
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

  protected itemFilter(operations: EnhancedOperation[]): boolean {
    return operations.length > 0
  }

  public async generateItem(operations: EnhancedOperation[]): Promise<Try<SourceFile>> {
    return success(
      createSourceFile(
        this.context.pathOf(this.input.document, this.name()),
        getSdkTypeImports(this.input.document, operations, this.context, true),
        [getSdkTypeAst(this.input.document, operations, this.context, this.config)],
      ),
    )
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression {
    const [operations] = this.items
    return operations.length > 0 ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [operations] = this.items
    return operations.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
