import { GeneratorConfig, Result } from '@oats-ts/generator'
import {
  createOpenAPIGeneratorContext,
  EnhancedOperation,
  getEnhancedOperations,
  hasResponseHeaders,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { OpenAPIObject, OperationObject } from '@oats-ts/openapi-model'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { getModelImports } from '@oats-ts/typescript-common'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { flatMap, isNil, negate, sortBy } from 'lodash'
import { factory, Identifier, ImportDeclaration } from 'typescript'
import { generateResponseHeadersDeserializer } from './generateResponseHeadersDeserializer'

export class ResponseHeadersParameterDeserializersGenerator
  implements OpenAPIGenerator<'openapi/response-headers-deserializer'>
{
  private context: OpenAPIGeneratorContext = null
  private operations: EnhancedOperation[]

  public readonly id = 'openapi/response-headers-deserializer'
  public readonly consumes: OpenAPIGeneratorTarget[] = []

  initialize(data: OpenAPIReadOutput, config: GeneratorConfig, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, config, generators)
    const { document, nameOf } = this.context
    this.operations = sortBy(getEnhancedOperations(document, this.context), ({ operation }) =>
      nameOf(operation, this.id),
    )
  }
  async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context } = this

    const data: TypeScriptModule[] = mergeTypeScriptModules(
      flatMap(this.operations, (operation: EnhancedOperation): TypeScriptModule[] =>
        [generateResponseHeadersDeserializer(operation, context)].filter(negate(isNil)),
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
