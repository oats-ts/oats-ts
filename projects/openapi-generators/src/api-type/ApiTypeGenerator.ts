import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { factory, ImportDeclaration, SourceFile, TypeReferenceNode } from 'typescript'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { ApiTypeGeneratorConfig } from './typings'
import { getApiTypeImports } from './getApiTypeImports'
import { getApiTypeAst } from './getApiTypeAst'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'

export class ApiTypeGenerator extends DocumentBasedCodeGenerator {
  public constructor(private readonly config: ApiTypeGeneratorConfig) {
    super(config)
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

  protected itemFilter(items: EnhancedOperation[]): boolean {
    return items.length > 0
  }

  public async generateItem(operations: EnhancedOperation[]): Promise<Try<SourceFile>> {
    return success(
      createSourceFile(
        this.context.pathOf(this.input.document, this.name()),
        getApiTypeImports(this.input.document, operations, this.context, true),
        [getApiTypeAst(this.input.document, operations, this.context, this.config)],
      ),
    )
  }

  public referenceOf(input: OpenAPIObject): TypeReferenceNode | undefined {
    const [operations] = this.items
    return operations.length > 0 ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [operations] = this.items
    return operations.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
