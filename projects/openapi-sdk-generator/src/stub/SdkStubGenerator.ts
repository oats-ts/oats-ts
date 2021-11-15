import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { generateSdkStub } from './generateSdkStub'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class SdkStubGenerator implements OpenAPIGenerator<'openapi/sdk-stub'> {
  private context: OpenAPIGeneratorContext = null

  public readonly id = 'openapi/sdk-stub'
  public readonly consumes: OpenAPIGeneratorTarget[] = [
    'openapi/operation',
    'openapi/request-type',
    'openapi/response-type',
    'openapi/sdk-type',
  ]

  public initialize(data: OpenAPIReadOutput, config: GeneratorConfig, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, config, generators)
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context } = this
    const { document, nameOf } = context
    const operations = sortBy(getEnhancedOperations(document, context), ({ operation }) =>
      nameOf(operation, 'openapi/operation'),
    )
    const data: TypeScriptModule[] = mergeTypeScriptModules([generateSdkStub(document, operations, context)])

    return {
      isOk: true,
      data,
      issues: [],
    }
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression {
    const { context } = this
    const { nameOf } = context
    return factory.createIdentifier(nameOf(input, this.id))
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const { context } = this
    return getModelImports(fromPath, this.id, [input], context)
  }
}
