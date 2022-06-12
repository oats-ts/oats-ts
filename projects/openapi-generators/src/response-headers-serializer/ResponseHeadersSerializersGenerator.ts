import {
  EnhancedOperation,
  getResponseHeaders,
  hasResponseHeaders,
  OpenAPIGeneratorTarget,
  RuntimePackages,
} from '@oats-ts/openapi-common'
import { OperationObject } from '@oats-ts/openapi-model'
import { success, Try } from '@oats-ts/try'
import { createSourceFile, getModelImports, getNamedImports } from '@oats-ts/typescript-common'
import { entries, flatMap, values } from 'lodash'
import { factory, Identifier, ImportDeclaration, SourceFile } from 'typescript'
import { OperationBasedCodeGenerator } from '../utils/OperationBasedCodeGenerator'
import { collectSchemaImports } from '../utils/serializers/collectSchemaImports'
import { getResponseHeadersSerializerAst } from './getResponseHeadersSerializerAst'

export class ResponseHeadersSerializersGenerator extends OperationBasedCodeGenerator {
  public name(): OpenAPIGeneratorTarget {
    return 'openapi/response-headers-serializer'
  }

  public consumes(): OpenAPIGeneratorTarget[] {
    return []
  }

  public runtimeDependencies(): string[] {
    return [RuntimePackages.ParameterSerialization.name]
  }

  protected itemFilter(data: EnhancedOperation): boolean {
    return hasResponseHeaders(data.operation, this.context)
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

  public referenceOf(input: OperationObject): Identifier | undefined {
    return hasResponseHeaders(input, this.context)
      ? factory.createIdentifier(this.context.nameOf(input, this.name()))
      : undefined
  }

  public dependenciesOf(fromPath: string, input: OperationObject): ImportDeclaration[] {
    return hasResponseHeaders(input, this.context) ? getModelImports(fromPath, this.name(), [input], this.context) : []
  }
}
