import { Try } from '@oats-ts/generator'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Severity } from '@oats-ts/validators'
import { OperationObject } from 'openapi3-ts'
import { flatMap, isNil, isEmpty, negate, sortBy } from 'lodash'
import { generateOperationFunction } from './operation/generateOperationFunction'
import { generateOperationReturnType } from './returnType/generateOperationReturnType'
import { generateOperationInputType } from './inputType/generateOperationInputType'
import {
  generateHeaderParameterTypeSerializer,
  generatePathParameterTypeSerializer,
  generateQueryParameterTypeSerializer,
} from './parameterSerializer/generateOperationParameterTypeSerializer'
import { generateResponseParserHint } from './expectations/generateExpectations'
import { OperationsGeneratorConfig } from './typings'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  hasInput,
  hasResponses,
} from '@oats-ts/openapi-common'
import { OpenAPIGeneratorTarget, OpenAPIGeneratorConfig } from '@oats-ts/openapi'
import { Expression, TypeNode, ImportDeclaration, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class OperationsGenerator implements OpenAPIGenerator {
  public static id = 'openapi/operations'
  private static consumes: OpenAPIGeneratorTarget[] = [
    'openapi/type',
    'openapi/headers-type',
    'openapi/query-type',
    'openapi/path-type',
  ]
  private static produces: OpenAPIGeneratorTarget[] = [
    'openapi/operation',
    'openapi/response-type',
    'openapi/input-type',
    'openapi/headers-serializer',
    'openapi/path-serializer',
    'openapi/query-serializer',
  ]

  private context: OpenAPIGeneratorContext = null
  private config: OpenAPIGeneratorConfig & OperationsGeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id: string = OperationsGenerator.id
  public readonly produces: string[] = OperationsGenerator.produces
  public readonly consumes: string[]

  public constructor(config: OpenAPIGeneratorConfig & OperationsGeneratorConfig) {
    this.config = config
    this.consumes = OperationsGenerator.consumes.concat(config.validate ? ['openapi/validator'] : [])
    this.produces = OperationsGenerator.produces.concat(config.validate ? ['openapi/expectations'] : [])
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
    this.operations = sortBy(getEnhancedOperations(this.context.accessor.document(), this.context), ({ operation }) =>
      this.context.accessor.name(operation, 'openapi/operation'),
    )
  }

  private enhance(input: OperationObject): EnhancedOperation {
    const operation = this.operations.find(({ operation }) => operation === input)
    if (isNil(operation)) {
      throw new Error(`${JSON.stringify(input)} is not a registered operation.`)
    }
    return operation
  }

  public async generate(): Promise<Try<TypeScriptModule[]>> {
    const { context, config } = this
    const { accessor } = context
    const operations = sortBy(getEnhancedOperations(accessor.document(), context), ({ operation }) =>
      accessor.name(operation, 'openapi/operation'),
    )
    const modules: TypeScriptModule[] = flatMap(operations, (operation: EnhancedOperation): TypeScriptModule[] => {
      return [
        generateOperationReturnType(operation, context),
        generateOperationInputType(operation, context),
        generatePathParameterTypeSerializer(operation, context),
        generateQueryParameterTypeSerializer(operation, context),
        generateHeaderParameterTypeSerializer(operation, context),
        ...(config.validate ? [generateResponseParserHint(operation, context, config)] : []),
        generateOperationFunction(operation, context, config),
      ].filter(negate(isNil))
    })

    if (context.issues.some((issue) => issue.severity === 'error')) {
      return { issues: context.issues }
    }
    return mergeTypeScriptModules(modules)
  }

  public reference(input: OperationObject, target: OpenAPIGeneratorTarget): TypeNode | Expression {
    const { context } = this
    const { accessor } = context
    switch (target) {
      case 'openapi/operation': {
        return factory.createIdentifier(accessor.name(input, target))
      }
      case 'openapi/response-type': {
        return hasResponses(input, context) ? factory.createTypeReferenceNode(accessor.name(input, target)) : undefined
      }
      case 'openapi/input-type': {
        return hasInput(this.enhance(input), context)
          ? factory.createTypeReferenceNode(accessor.name(input, target))
          : undefined
      }
      case 'openapi/headers-serializer': {
        const { header } = this.enhance(input)
        return isEmpty(header) ? undefined : factory.createIdentifier(context.accessor.name(input, target))
      }
      case 'openapi/path-serializer': {
        const { path } = this.enhance(input)
        return isEmpty(path) ? undefined : factory.createIdentifier(context.accessor.name(input, target))
      }
      case 'openapi/query-serializer':
        const { query } = this.enhance(input)
        return isEmpty(query) ? undefined : factory.createIdentifier(context.accessor.name(input, target))
      case 'openapi/expectations': {
        return hasResponses(input, context) ? factory.createIdentifier(context.accessor.name(input, target)) : undefined
      }
      default:
        return undefined
    }
  }

  public dependencies(fromPath: string, input: OperationObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    const { context } = this
    switch (target) {
      case 'openapi/operation': {
        return getModelImports(fromPath, target, [input], this.context)
      }
      case 'openapi/response-type': {
        return hasResponses(input, context) ? getModelImports(fromPath, target, [input], this.context) : []
      }
      case 'openapi/input-type': {
        return hasInput(this.enhance(input), context)
          ? getModelImports(fromPath, target, [input], this.context)
          : undefined
      }
      case 'openapi/headers-serializer': {
        const { header } = this.enhance(input)
        return isEmpty(header) ? undefined : getModelImports(fromPath, target, [input], this.context)
      }
      case 'openapi/path-serializer': {
        const { path } = this.enhance(input)
        return isEmpty(path) ? undefined : getModelImports(fromPath, target, [input], this.context)
      }
      case 'openapi/query-serializer':
        const { query } = this.enhance(input)
        return isEmpty(query) ? undefined : getModelImports(fromPath, target, [input], this.context)
      case 'openapi/expectations': {
        return hasResponses(input, context) ? getModelImports(fromPath, target, [input], this.context) : undefined
      }
      default:
        return []
    }
  }
}
