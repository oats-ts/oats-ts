import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { generateSdkClass } from './generateSdkClass'
import { ClientSdkGeneratorConfig } from './typings'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class ClientSdkGenerator implements OpenAPIGenerator {
  public static id = 'openapi/client-sdk'
  private static consumes: OpenAPIGeneratorTarget[] = [
    'openapi/operation',
    'openapi/request-type',
    'openapi/response-type',
    'openapi/sdk-type',
  ]
  private static produces: OpenAPIGeneratorTarget[] = ['openapi/client-sdk']

  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & ClientSdkGeneratorConfig

  public readonly id: string = ClientSdkGenerator.id
  public readonly produces: string[] = ClientSdkGenerator.produces
  public readonly consumes: string[] = ClientSdkGenerator.consumes

  public constructor(config: GeneratorConfig & ClientSdkGeneratorConfig) {
    this.config = config
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
    const { document, nameOf } = context
    const operations = sortBy(getEnhancedOperations(document, context), ({ operation }) =>
      nameOf(operation, 'openapi/operation'),
    )
    const data: TypeScriptModule[] = mergeTypeScriptModules([generateSdkClass(document, operations, context, config)])

    return {
      isOk: true,
      data,
      issues: [],
    }
  }

  public referenceOf(input: OpenAPIObject, target: OpenAPIGeneratorTarget): TypeNode | Expression {
    const { context } = this
    const { nameOf } = context
    switch (target) {
      case 'openapi/client-sdk': {
        return factory.createIdentifier(nameOf(input, target))
      }
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    const { context } = this
    switch (target) {
      case 'openapi/client-sdk': {
        return getModelImports(fromPath, target, [input], context)
      }
      default:
        return []
    }
  }
}
