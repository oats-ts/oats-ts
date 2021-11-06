import { GeneratorConfig, Result } from '@oats-ts/generator'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi'
import {
  createOpenAPIGeneratorContext,
  EnhancedOperation,
  getEnhancedOperations,
  hasResponseHeaders,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
} from '@oats-ts/openapi-common'
import { OpenAPIObject, OperationObject } from '@oats-ts/openapi-model'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { getModelImports } from '@oats-ts/typescript-common'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { flatMap, isNil, negate, sortBy } from 'lodash'
import { factory, Identifier, ImportDeclaration } from 'typescript'
import { generateResponseHeadersSerializer } from './generateResponseHeadersSerializer'

export class ResponseHeadersParameterSerializersGenerator
  implements OpenAPIGenerator<'openapi/response-headers-serializer'>
{
  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id = 'openapi/response-headers-serializer'
  public readonly consumes: OpenAPIGeneratorTarget[] = []

  public constructor(config: GeneratorConfig) {
    this.config = config
  }

  initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
    const { document, nameOf } = this.context
    this.operations = sortBy(getEnhancedOperations(document, this.context), ({ operation }) =>
      nameOf(operation, this.id),
    )
  }

  async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context } = this

    const data: TypeScriptModule[] = mergeTypeScriptModules(
      flatMap(this.operations, (operation: EnhancedOperation): TypeScriptModule[] =>
        [generateResponseHeadersSerializer(operation, context)].filter(negate(isNil)),
      ),
    )
    // TODO maybe try-catch?
    return {
      isOk: true,
      issues: [],
      data,
    }
  }

  public referenceOf(input: OperationObject): Identifier {
    const { context } = this
    const { nameOf } = context
    return hasResponseHeaders(input, context) ? factory.createIdentifier(nameOf(input, this.id)) : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    const { context } = this
    return hasResponseHeaders(input, context) ? getModelImports(fromPath, this.id, [input], context) : []
  }
}