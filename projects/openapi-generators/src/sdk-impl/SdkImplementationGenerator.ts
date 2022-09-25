import { flatMap } from 'lodash'
import { OpenAPIGeneratorTarget, RuntimePackages, EnhancedOperation } from '@oats-ts/openapi-common'
import { SdkGeneratorConfig } from '../utils/sdk/typings'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration, SourceFile } from 'typescript'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { Try, success } from '@oats-ts/try'
import { getSdkTypeImports } from '../utils/sdk/getSdkTypeImports'
import { getSdkClassAst } from './getSdkClassAst'
import { DocumentBasedCodeGenerator } from '../utils/DocumentBasedCodeGenerator'
import { RuntimeDependency, version } from '@oats-ts/oats-ts'

export class SdkImplementationGenerator extends DocumentBasedCodeGenerator<SdkGeneratorConfig> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/sdk-impl'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['oats/operation', 'oats/request-type', 'oats/response-type', 'oats/sdk-type']
  }

  public runtimeDependencies(): RuntimeDependency[] {
    return [{ name: RuntimePackages.Http.name, version }]
  }

  public async generateItem(operations: EnhancedOperation[]): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(this.input.document, this.name())
    return success(
      createSourceFile(
        path,
        [
          getNamedImports(RuntimePackages.Http.name, [RuntimePackages.Http.ClientAdapter]),
          ...getSdkTypeImports(this.input.document, operations, this.context, true),
          ...this.context.dependenciesOf(path, this.input.document, 'oats/sdk-type'),
          ...flatMap(operations, ({ operation }) => this.context.dependenciesOf(path, operation, 'oats/operation')),
        ],
        [getSdkClassAst(this.input.document, operations, this.context, this.configuration())],
      ),
    )
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression | undefined {
    const [operations] = this.items
    return operations.length > 0 ? factory.createIdentifier(this.context.nameOf(input, this.name())) : undefined
  }
  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const [operations] = this.items
    return operations.length > 0 ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
