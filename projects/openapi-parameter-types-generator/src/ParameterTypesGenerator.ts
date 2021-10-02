import { TypeScriptModule, mergeTypeScriptModules } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { flatMap, isEmpty, isNil, negate, sortBy, values } from 'lodash'
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
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { ParameterTypesGeneratorConfig } from './typings'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { HeadersObject, OperationObject } from '@oats-ts/openapi-model'
import { TypeNode, ImportDeclaration, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'
import { getParameterTypeLiteralAst } from './getParameterTypeLiteralAst'
import { getParameterSchemaObject } from './getParameterSchemaObject'
import { getReferencedNamedSchemas } from '@oats-ts/model-common'

export class ParameterTypesGenerator implements OpenAPIGenerator {
  public static id = 'openapi/parameterTypes'
  private static consumes: OpenAPIGeneratorTarget[] = ['openapi/type']
  private static produces: OpenAPIGeneratorTarget[] = [
    'openapi/headers-type',
    'openapi/path-type',
    'openapi/query-type',
    'openapi/response-headers-type',
  ]

  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & ParameterTypesGeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id: string = ParameterTypesGenerator.id
  public readonly produces: string[] = ParameterTypesGenerator.produces
  public readonly consumes: string[] = ParameterTypesGenerator.consumes

  public constructor(config: GeneratorConfig & ParameterTypesGeneratorConfig) {
    this.config = config
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
    const { document, nameOf } = this.context
    this.operations = sortBy(getEnhancedOperations(document, this.context), ({ operation }) =>
      nameOf(operation, 'openapi/operation'),
    )
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this

    const data: TypeScriptModule[] = mergeTypeScriptModules(
      flatMap(this.operations, (operation: EnhancedOperation): TypeScriptModule[] => {
        return [
          generatePathParametersType(operation, context, config),
          generateQueryParametersType(operation, context, config),
          generateHeaderParametersType(operation, context, config),
        ].filter(negate(isNil))
      }),
    )

    return {
      isOk: true,
      issues: [],
      data,
    }
  }

  private enhance(input: OperationObject): EnhancedOperation {
    const operation = this.operations.find(({ operation }) => operation === input)
    if (isNil(operation)) {
      throw new Error(`${JSON.stringify(input)} is not a registered operation.`)
    }
    return operation
  }

  public referenceOf(input: OperationObject | HeadersObject, target: OpenAPIGeneratorTarget): TypeNode {
    const { context } = this
    const { nameOf, dereference } = context
    switch (target) {
      case 'openapi/headers-type': {
        const { header } = this.enhance(input as OperationObject)
        return isEmpty(header) ? undefined : factory.createTypeReferenceNode(nameOf(input, target))
      }
      case 'openapi/path-type': {
        const { path } = this.enhance(input as OperationObject)
        return isEmpty(path) ? undefined : factory.createTypeReferenceNode(nameOf(input, target))
      }
      case 'openapi/query-type': {
        const { query } = this.enhance(input as OperationObject)
        return isEmpty(query) ? undefined : factory.createTypeReferenceNode(nameOf(input, target))
      }
      // TODO can't generate a named type for this, as it has no deriveable name...
      case 'openapi/response-headers-type': {
        const headers = values((input as HeadersObject) || {}).map((header) => dereference(header, true))
        return isEmpty(headers)
          ? factory.createTypeReferenceNode('undefined')
          : getParameterTypeLiteralAst(headers, context, this.config)
      }
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: OperationObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    const { context } = this
    const { dereference, dependenciesOf } = context
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
      case 'openapi/response-headers-type':
        const headers = values((input as HeadersObject) || {}).map((header) => dereference(header, true))
        const referencedSchemas = getReferencedNamedSchemas(getParameterSchemaObject(headers, context), context)
        return flatMap(referencedSchemas, (schema) => dependenciesOf(fromPath, schema, 'openapi/type'))
      default:
        return []
    }
  }
}
