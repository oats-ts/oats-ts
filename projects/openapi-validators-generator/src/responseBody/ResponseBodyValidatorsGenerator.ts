import { Result, GeneratorConfig } from '@oats-ts/generator'
import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OperationObject } from '@oats-ts/openapi-model'
import { flatMap, isNil, negate, sortBy } from 'lodash'
import { generateResponseBodyValidator } from './generateResponseBodyValidator'
import {
  EnhancedOperation,
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  hasResponses,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { Expression, TypeNode, ImportDeclaration, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'

export class ResponseBodyValidatorsGenerator implements OpenAPIGenerator<'openapi/response-body-validator'> {
  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig
  private operations: EnhancedOperation[]

  public readonly id = 'openapi/response-body-validator'
  public readonly consumes: OpenAPIGeneratorTarget[] = ['openapi/type', 'openapi/type-validator']

  public constructor(config: GeneratorConfig) {
    this.config = config
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
    const { document, nameOf } = this.context
    this.operations = sortBy(getEnhancedOperations(document, this.context), ({ operation }) =>
      nameOf(operation, 'openapi/response-body-validator'),
    )
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context } = this

    const data: TypeScriptModule[] = mergeTypeScriptModules(
      flatMap(this.operations, (operation: EnhancedOperation): TypeScriptModule[] =>
        [generateResponseBodyValidator(operation, context)].filter(negate(isNil)),
      ),
    )

    return {
      isOk: true,
      issues: [],
      data,
    }
  }

  public referenceOf(input: OperationObject): TypeNode | Expression {
    const { context } = this
    const { nameOf } = context
    return hasResponses(input, context) ? factory.createIdentifier(nameOf(input, this.id)) : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    const { context } = this
    return hasResponses(input, context) ? getModelImports(fromPath, this.id, [input], this.context) : undefined
  }
}
