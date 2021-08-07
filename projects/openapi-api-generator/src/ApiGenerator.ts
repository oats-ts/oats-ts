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
import { generateApiClass } from './apiClass/generateApiClass'
import { generateApiStub } from './apiStub/generateApiStub'
import { generateApiType } from './apiType/generateApiType'
import { ApiGeneratorConfig } from './typings'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration } from 'typescript'
import { getModelImports } from '../../typescript-common/lib'

export class ApiGenerator implements OpenAPIGenerator {
  public static id = 'openapi/validators'
  private static consumes: OpenAPIGeneratorTarget[] = ['openapi/operation', 'openapi/input-type']
  private static produces: OpenAPIGeneratorTarget[] = ['openapi/api-class', 'openapi/api-stub', 'openapi/api-type']

  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & ApiGeneratorConfig

  public readonly id: string = ApiGenerator.id
  public readonly produces: string[] = ApiGenerator.produces
  public readonly consumes: string[] = ApiGenerator.consumes

  public constructor(config: GeneratorConfig & ApiGeneratorConfig) {
    this.config = config
    this.produces = ApiGenerator.produces.filter((target) => {
      switch (target) {
        case 'openapi/api-type':
          return config.type
        case 'openapi/api-class':
          return config.class
        case 'openapi/api-stub':
          return config.stub
        default:
          return false
      }
    })
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
    const data: TypeScriptModule[] = mergeTypeScriptModules([
      ...(config.type ? [generateApiType(document, operations, context, config)] : []),
      ...(config.class ? [generateApiClass(document, operations, context, config)] : []),
      ...(config.stub ? [generateApiStub(document, operations, context, config)] : []),
    ])

    return {
      isOk: true,
      data,
      issues: [],
    }
  }

  public referenceOf(input: OpenAPIObject, target: OpenAPIGeneratorTarget): TypeNode | Expression {
    const { context, config } = this
    const { nameOf } = context
    switch (target) {
      case 'openapi/api-type': {
        return config.type ? factory.createTypeReferenceNode(nameOf(input, target)) : undefined
      }
      case 'openapi/api-class': {
        return config.class ? factory.createIdentifier(nameOf(input, target)) : undefined
      }
      case 'openapi/api-stub': {
        return config.stub ? factory.createIdentifier(nameOf(input, target)) : undefined
      }
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    const { context, config } = this
    switch (target) {
      case 'openapi/api-type': {
        return config.type ? getModelImports(fromPath, target, [input], context) : []
      }
      case 'openapi/api-class': {
        return config.class ? getModelImports(fromPath, target, [input], context) : []
      }
      case 'openapi/api-stub': {
        return config.stub ? getModelImports(fromPath, target, [input], context) : []
      }
      default:
        return []
    }
  }
}
