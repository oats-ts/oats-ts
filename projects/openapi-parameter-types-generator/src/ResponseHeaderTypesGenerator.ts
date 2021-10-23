import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { flatMap, isEmpty, values } from 'lodash'
import { OpenAPIGenerator, OpenAPIGeneratorContext, createOpenAPIGeneratorContext } from '@oats-ts/openapi-common'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import { ParameterTypesGeneratorConfig } from './typings'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { HeadersObject } from '@oats-ts/openapi-model'
import { TypeNode, ImportDeclaration, factory } from 'typescript'
import { getParameterTypeLiteralAst } from './getParameterTypeLiteralAst'
import { getParameterSchemaObject } from './getParameterSchemaObject'
import { getReferencedNamedSchemas } from '@oats-ts/model-common'

export class ResponseHeaderTypesGenerator implements OpenAPIGenerator {
  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig & ParameterTypesGeneratorConfig

  public readonly id: string = 'openapi/response-header-types'
  public readonly produces: OpenAPIGeneratorTarget[] = ['openapi/response-headers-type']
  public readonly consumes: OpenAPIGeneratorTarget[] = ['openapi/type']

  public constructor(config: GeneratorConfig & ParameterTypesGeneratorConfig) {
    this.config = config
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
  }

  // Nothing to generate
  public async generate(): Promise<Result<TypeScriptModule[]>> {
    return {
      isOk: true,
      issues: [],
      data: [],
    }
  }

  public referenceOf(input: HeadersObject, target: OpenAPIGeneratorTarget): TypeNode {
    const { context } = this
    const { dereference } = context
    switch (target) {
      // Can't generate a named type for this, as it has no deriveable name...
      case 'openapi/response-headers-type': {
        const headers = values(input || {}).map((header) => dereference(header, true))
        return isEmpty(headers)
          ? factory.createTypeReferenceNode('undefined')
          : getParameterTypeLiteralAst(headers, context, this.config)
      }
      default:
        return undefined
    }
  }

  public dependenciesOf(fromPath: string, input: HeadersObject, target: OpenAPIGeneratorTarget): ImportDeclaration[] {
    const { context } = this
    const { dereference, dependenciesOf } = context
    switch (target) {
      case 'openapi/response-headers-type':
        const headers = values(input || {}).map((header) => dereference(header, true))
        const referencedSchemas = getReferencedNamedSchemas(getParameterSchemaObject(headers, context), context)
        return flatMap(referencedSchemas, (schema) => dependenciesOf(fromPath, schema, 'openapi/type'))
      default:
        return []
    }
  }
}
