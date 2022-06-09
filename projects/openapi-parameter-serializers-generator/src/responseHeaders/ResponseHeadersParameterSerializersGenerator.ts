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
import { getResponseHeadersSerializerAst } from './getResponseHeadersSerializerAst'

export class ResponseHeadersParameterSerializersGenerator extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  EnhancedOperation,
  OpenAPIGeneratorContext
> {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/response-headers-serializer'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return []
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.ParameterSerialization.name]
  }

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(this.input, this.globalConfig, this.dependencies)
  }

  protected getItems(): EnhancedOperation[] {
    return sortBy(getEnhancedOperations(this.input.document, this.context), ({ operation }) =>
      this.context.nameOf(operation, this.name()),
    ).filter((data) => hasResponseHeaders(data.operation, this.context))
  }

  protected async generateItem(data: EnhancedOperation): Promise<Try<SourceFile>> {
    const path = this.context.pathOf(data.operation, this.name())
    const headersByStatus = getResponseHeaders(data.operation, this.context)
    const parameters = flatMap(values(headersByStatus), (headers) => values(headers))
    return success(
      createSourceFile(
        path,
        [
          getNamedImports(RuntimePackages.ParameterSerialization.name, [
            RuntimePackages.ParameterSerialization.createHeaderSerializer,
            RuntimePackages.ParameterSerialization.serializers,
          ]),
          ...flatMap(entries(headersByStatus), ([statusCode]) =>
            this.context.dependenciesOf(path, [data.operation, statusCode], 'openapi/response-headers-type'),
          ),
          ...collectSchemaImports(path, parameters, this.context),
        ],
        [getResponseHeadersSerializerAst(data, this.context)],
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
