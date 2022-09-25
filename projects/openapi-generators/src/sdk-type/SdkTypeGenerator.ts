import { OpenAPIGeneratorTarget, EnhancedOperation } from '@oats-ts/openapi-common'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration, SourceFile } from 'typescript'
import { createSourceFile, getModelImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { getSdkTypeImports } from '../utils/sdk/getSdkTypeImports'
import { getSdkTypeAst } from './getSdkTypeAst'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'
import { RuntimeDependency } from '@oats-ts/oats-ts'

export class SdkTypeGenerator extends DocumentBasedCodeGenerator<SdkGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/sdk-type'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/operation', 'oats/request-type', 'oats/response-type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return []
  }

  public async generateItem(operations: EnhancedOperation[]): Promise<Try<SourceFile>> {
    return success(
      createSourceFile(
        this.context.pathOf(this.input.document, this.name()),
        getSdkTypeImports(this.input.document, operations, this.context, true),
        [getSdkTypeAst(this.input.document, operations, this.context, this.configuration())],
      ),
    )
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression | undefined {
    const [operations] = this.items
    return operations.length > 0 ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [operations] = this.items
    return operations.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
