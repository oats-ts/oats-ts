import {
  createOpenAPIGeneratorContext,
  EnhancedPathItem,
  getEnhancedPathItems,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration, SourceFile } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { BaseCodeGenerator, RuntimeDependency, version } from '@oats-ts/oats-ts'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { CorsConfigurationGeneratorConfig } from './typings'
import { getCorsConfigurationStatement } from './getCorsConfigurationStatement'

export class CorsConfigurationGenerator extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  CorsConfigurationGeneratorConfig,
  EnhancedPathItem[],
  OpenAPIGeneratorContext
> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/cors-configuration'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return []
  }
  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: RuntimePackages.Http.name, version }]
  }

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(this, this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): EnhancedPathItem[][] {
    const paths = getEnhancedPathItems(this.input.document, this.context).filter(
      ({ operations }) => operations.length > 0,
    )
    return [paths].filter((p) => p.length > 0)
  }

  protected async generateItem(paths: EnhancedPathItem[]): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(this.context.document, this.name())
    return success(
      createSourceFile(
        path,
        [getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.MainCorsConfig])],
        [getCorsConfigurationStatement(paths, this.context, this.configuration())],
      ),
    )
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression | undefined {
    const [operations] = this.items
    return operations?.length > 0 ? factory.createTypeReferenceNode(this.context.nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [operations] = this.items
    return operations?.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
