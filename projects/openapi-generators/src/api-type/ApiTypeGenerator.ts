import { EnhancedOperation, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { factory, ImportDeclaration, SourceFile, TypeReferenceNode } from 'typescript'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { ApiTypeGeneratorConfig } from './typings'
import { getApiTypeImports } from './getApiTypeImports'
import { getApiTypeAst } from './getApiTypeAst'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'
import { RuntimeDependency } from '@oats-ts/oats-ts'

export class ApiTypeGenerator extends DocumentBasedCodeGenerator<ApiTypeGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/api-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/request-server-type', 'oats/response-server-type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return []
  }

  public async generateItem(operations: EnhancedOperation[]): Promise<Try<SourceFile>> {
    return success(
      createSourceFile(
        this.context.pathOf(this.input.document, this.name()),
        getApiTypeImports(this.input.document, operations, this.context, true),
        [getApiTypeAst(this.input.document, operations, this.context, this.configuration())],
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
