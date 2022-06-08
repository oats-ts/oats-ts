import { BaseCodeGenerator } from '@oats-ts/generator'
import {
  createOpenAPIGeneratorContext,
  EnhancedOperation,
  getEnhancedOperations,
  getResponseHeaders,
  hasResponseHeaders,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { OperationObject } from '@oats-ts/openapi-model'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { entries, flatMap, sortBy, values } from 'lodash'
import { factory, Identifier, ImportDeclaration, SourceFile } from 'typescript'
import { collectSchemaImports } from '../collectSchemaImports'
import { getResponseHeadersDeserializerAst } from './getResponseHeadersDeserializerAst'

export class ResponseHeadersParameterDeserializersGenerator extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  EnhancedOperation,
  OpenAPIGeneratorContext
> {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/response-headers-deserializer'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return ['json-schema/type']
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.ParameterDeserialization.name]
  }

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): EnhancedOperation[] {
    return sortBy(getEnhancedOperations(this.input.document, this.context), ({ operation }) =>
      this.context.nameOf(operation, this.name()),
    ).filter(({ operation }) => hasResponseHeaders(operation, this.context))
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, this.name())
    const headersByStatus = getResponseHeaders(data.operation, this.context)
    const parameters = flatMap(values(headersByStatus), (headers) => values(headers))
    return success(
      createSourceFile(
        path,
        [
          getNamedImports(RuntimePackages.ParameterDeserialization.name, [
            RuntimePackages.ParameterDeserialization.deserializers,
            RuntimePackages.ParameterDeserialization.createHeaderDeserializer,
          ]),
          ...flatMap(entries(headersByStatus), ([statusCode]) =>
            this.context.dependenciesOf(path, [data.operation, statusCode], 'openapi/response-headers-type'),
          ),
          ...collectSchemaImports(path, parameters, this.context),
        ],
        [getResponseHeadersDeserializerAst(data, this.context)],
      ),
    )
  }

  public referenceOf(input: OperationObject): Identifier {
    return hasResponseHeaders(input, this.context)
      ? factory.createIdentifier(this.context.nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasResponseHeaders(input, this.context) ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
