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
import { generateApiType } from './generateApiType'
import { ApiTypeGeneratorConfig } from './typings'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class ApiTypeGenerator implements OpenAPIGenerator<'openapi/api-type'> {
  private context: OpenAPIGeneratorContext = null
  private apiTypeConfig: ApiTypeGeneratorConfig

  public readonly id = 'openapi/api-type'
  public readonly consumes: OpenAPIGeneratorTarget[] = ['openapi/request-server-type', 'openapi/response-type']

  public constructor(config: ApiTypeGeneratorConfig) {
    this.apiTypeConfig = config
  }

  public initialize(data: OpenAPIReadOutput, config: GeneratorConfig, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, config, generators)
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, apiTypeConfig } = this
    const { document, nameOf } = context
    const operations = sortBy(getEnhancedOperations(document, context), ({ operation }) =>
      nameOf(operation, 'openapi/operation'),
    )
    const data: TypeScriptModule[] = mergeTypeScriptModules([
      generateApiType(document, operations, context, apiTypeConfig),
    ])

    return {
      isOk: true,
      data,
      issues: [],
    }
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression {
    const { context } = this
    const { nameOf } = context
    return factory.createTypeReferenceNode(nameOf(input, this.id))
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const { context } = this
    return getModelImports(fromPath, this.id, [input], context)
  }
}
