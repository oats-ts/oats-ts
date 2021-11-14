import { GeneratorConfig, Result } from '@oats-ts/generator'
import {
  createOpenAPIGeneratorContext,
  EnhancedOperation,
  getEnhancedOperations,
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
import { generateResponseHeadersDeserializer as generateResponseHeadersDeserializer } from './generateResponseHeadersDeserializer'

export class ResponseHeadersParameterDeserializersGenerator
  implements OpenAPIGenerator<'openapi/response-headers-deserializer'>
{
  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id = 'openapi/response-headers-deserializer'
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
    return factory.createIdentifier(nameOf(input, this.id))
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const { context } = this
    return getModelImports(fromPath, this.id, [input], context)
  }
}
