import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  EnhancedOperation,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'
import { generateCorsMiddleware } from './generateCorsMiddleware'

export class ExpressCorsMiddlewareGenerator implements OpenAPIGenerator<'openapi/express-cors-middleware'> {
  private context: OpenAPIGeneratorContext = null
  private operations: EnhancedOperation[] = []

  public readonly id = 'openapi/express-cors-middleware'
  public readonly consumes: OpenAPIGeneratorTarget[] = []
  public readonly runtimeDepencencies: string[] = [RuntimePackages.Express.name]

  public initialize(data: OpenAPIReadOutput, config: GeneratorConfig, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, config, generators)
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context } = this
    const { document, nameOf } = context
    this.operations = sortBy(getEnhancedOperations(document, context), ({ operation }) =>
      nameOf(operation, 'openapi/express-route'),
    )
    const data: TypeScriptModule[] =
      this.operations.length > 0 ? mergeTypeScriptModules([generateCorsMiddleware(this.operations, context)]) : []

    return {
      isOk: true,
      data,
      issues: [],
    }
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression {
    const { context } = this
    const { nameOf } = context
    return this.operations.length > 0 ? factory.createTypeReferenceNode(nameOf(input, this.id)) : undefined
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const { context } = this
    return this.operations.length > 0 ? getModelImports(fromPath, this.id, [input], context) : []
  }
}
