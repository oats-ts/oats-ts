import { mergeTypeScriptModules, TypeScriptModule } from '@oats-ts/typescript-writer'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { sortBy } from 'lodash'
import {
  getEnhancedOperations,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { Result, GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { TypeNode, Expression, factory, ImportDeclaration } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'
import { generateRoutesType } from './generateRoutesType'

export class ExpressRoutesTypeGenerator implements OpenAPIGenerator<'openapi/express-routes-type'> {
  private context: OpenAPIGeneratorContext = null
  private config: GeneratorConfig

  public readonly id = 'openapi/express-routes-type'
  public readonly consumes: OpenAPIGeneratorTarget[] = ['openapi/express-route']

  public constructor(config: GeneratorConfig) {
    this.config = config
  }

  public initialize(data: OpenAPIReadOutput, generators: OpenAPIGenerator[]): void {
    this.context = createOpenAPIGeneratorContext(data, this.config, generators)
  }

  public async generate(): Promise<Result<TypeScriptModule[]>> {
    const { context, config } = this
    const { document, nameOf } = context
    const operations = sortBy(getEnhancedOperations(document, context), ({ operation }) =>
      nameOf(operation, 'openapi/express-route'),
    )
    const data: TypeScriptModule[] = mergeTypeScriptModules([generateRoutesType(operations, context)])

    return {
      isOk: true,
      data,
      issues: [],
    }
  }

  public referenceOf(input: OpenAPIObject): TypeNode | Expression {
    const { context } = this
    const { nameOf } = context
    return factory.createTypeReferenceNode(nameOf(input, this.id))
  }

  public dependenciesOf(fromPath: string, input: OpenAPIObject): ImportDeclaration[] {
    const { context } = this
    return getModelImports(fromPath, this.id, [input], context)
  }
}
