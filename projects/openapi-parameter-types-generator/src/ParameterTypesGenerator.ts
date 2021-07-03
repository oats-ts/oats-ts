import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Severity } from '@oats-ts/validators'
import { flatMap, isEmpty, isNil, negate, sortBy } from 'lodash'
import {
  generateHeaderParametersType,
  generatePathParametersType,
  generateQueryParametersType,
} from './generateOperationParameterType'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { OpenAPIGeneratorTarget, OpenAPIGeneratorConfig } from '@oats-ts/openapi'
import { ParameterTypesGeneratorConfig } from './typings'
import { Try } from '@oats-ts/generator'
import { OperationObject } from 'openapi3-ts/dist'
import { TypeNode, ImportDeclaration, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class ParameterTypesGenerator implements OpenAPIGenerator {
  public static id = 'openapi/parameterTypes'
  public static consumes: OpenAPIGeneratorTarget[] = ['openapi/type']
  public static produces: OpenAPIGeneratorTarget[] = [
    'openapi/headers-type',
    'openapi/path-type',
    'openapi/query-type',
  ]

  private context: OpenAPIGeneratorContext = null
  private config: OpenAPIGeneratorConfig & ParameterTypesGeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id: string = ParameterTypesGenerator.id
  public readonly produces: string[] = ParameterTypesGenerator.produces
  public readonly consumes: string[] = ParameterTypesGenerator.consumes

  public constructor(config: OpenAPIGeneratorConfig & ParameterTypesGeneratorConfig) {
    this.config = config
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
    this.operations = sortBy(getEnhancedOperations(this.context.accessor.document(), this.context), ({ operation }) =>
      this.context.accessor.name(operation, 'openapi/operation'),
    )
  }

  public async generate(): Promise<Try<TypeScriptModule[]>> {
    const { context, config } = this
    const modules: TypeScriptModule[] = flatMap(this.operations, (operation: EnhancedOperation): TypeScriptModule[] => {
      return [
        generatePathParametersType(operation, context, config),
        generateQueryParametersType(operation, context, config),
        generateHeaderParametersType(operation, context, config),
      ].filter(negate(isNil))
    })

    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return mergeTypeScriptModules(modules)
  }

  private enhance(input: OperationObject): EnhancedOperation {
    const operation = this.operations.find(({ operation }) => operation === input)
    if (isNil(operation)) {
      throw new Error(`${JSON.stringify(input)} is not a registered operation.`)
    }
    return operation
  }

  public reference(input: OperationObject, target: OpenAPIGeneratorTarget): TypeNode {
    const { context } = this
    switch (target) {
      case 'openapi/headers-type': {
        const { header } = this.enhance(input)
        return isEmpty(header) ? undefined : factory.createTypeReferenceNode(context.accessor.name(input, target))
      }
      case 'openapi/path-type': {
        const { path } = this.enhance(input)
        return isEmpty(path) ? undefined : factory.createTypeReferenceNode(context.accessor.name(input, target))
      }
      case 'openapi/query-type':
        const { query } = this.enhance(input)
        return isEmpty(query) ? undefined : factory.createTypeReferenceNode(context.accessor.name(input, target))
      default:
        return undefined
    }
  }

  public dependencies(fromPath: string, input: OperationObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    switch (target) {
      case 'openapi/headers-type': {
        const { header } = this.enhance(input)
        return isEmpty(header) ? [] : getModelImports(fromPath, 'openapi/headers-type', [input], this.context)
      }
      case 'openapi/path-type': {
        const { path } = this.enhance(input)
        return isEmpty(path) ? [] : getModelImports(fromPath, 'openapi/path-type', [input], this.context)
      }
      case 'openapi/query-type':
        const { query } = this.enhance(input)
        return isEmpty(query) ? [] : getModelImports(fromPath, 'openapi/query-type', [input], this.context)
      default:
        return []
    }
  }
}
