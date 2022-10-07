import { EnhancedPathItem, OpenAPIGeneratorTarget, RuntimePackages } from '@oats-ts/openapi-common'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { factory, ImportDeclaration, SourceFile, Identifier } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { success, Try } from '@oats-ts/try'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'
import { CorsConfigurationGeneratorConfig } from './typings'
import { getCorsConfigurationStatement } from './getCorsConfigurationStatement'
import { PathBasedCodeGenerator } from '../utils/PathBasedCodeGenerator'
import { Issue } from '@oats-ts/validators'
import { getCorsEnabledPaths } from './getCorsEnabledPaths'

export class CorsConfigurationGenerator extends PathBasedCodeGenerator<CorsConfigurationGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/cors-configuration'
  }
  public consumes(): OpenAPIGeneratorTarget[] {
    return []
  }
  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: RuntimePackages.Http.name, version }]
  }

  protected async generateItem(paths: EnhancedPathItem[]): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(this.context.document, this.name())
    return success(
      createSourceFile(
        path,
        [getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.CorsConfiguration])],
        [getCorsConfigurationStatement(paths, this.context, this.configuration())],
      ),
    )
  }

  public getPreGenerateIssues(): Issue[] {
    const { items } = this
    // No paths we don't care
    if (items.length === 0) {
      return []
    }
    const [paths] = items
    // If we don't have any CORS enabled operations we complain
    if (getCorsEnabledPaths(paths, this.configuration()).length === 0) {
      return [
        {
          message: `no paths enabled by configuration`,
          path: this.name(),
          severity: 'warning',
        },
      ]
    }
    return []
  }

  public referenceOf(input: OpenAPIObject): Identifier | undefined {
    const [paths] = this.items
    return paths?.length > 0 ? factory.createIdentifier(this.context.nameOf(input, this.name())) : undefined
  }

  public dependenciesOf(fromPath: string, input: any): ImportDeclaration[] {
    const [paths] = this.items
    return paths?.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
