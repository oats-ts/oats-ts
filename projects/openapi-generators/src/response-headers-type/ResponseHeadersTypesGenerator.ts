import { flatMap, isNil, keys, sortBy, values } from 'lodash'
import {
  EnhancedOperation,
  getEnhancedOperations,
  hasResponseHeaders,
  OpenAPIGeneratorTarget,
} from '@oats-ts/openapi-common'
import { ResponseParameterInput } from '../utils/parameterTypings'
import { TypeNode, ImportDeclaration, factory } from 'typescript'
import { getModelImports } from '@oats-ts/typescript-common'
import { getResponseHeaders } from '@oats-ts/openapi-common'
import { HeaderObject, ResponsesObject } from '@oats-ts/openapi-model'
import { ParameterTypesGenerator } from '../utils/ParameterTypesGenerator'

const EmptyResponsesObject: ResponsesObject = { default: undefined }

type ResponseParameterInputInternal = [EnhancedOperation, string]

export class ResponseHeadersTypesGenerator extends ParameterTypesGenerator<ResponseParameterInputInternal> {
  public name(): OpenAPIGeneratorTarget {
    return 'oats/response-headers-type'
  }

  protected getItems(): ResponseParameterInputInternal[] {
    const operations = sortBy(getEnhancedOperations(this.input.document, this.context), ({ operation }) =>
      this.context.nameOf(operation),
    )
    return flatMap(operations, (operation: EnhancedOperation): ResponseParameterInputInternal[] => {
      if (!hasResponseHeaders(operation.operation, this.context)) {
        return []
      }
      return keys(getResponseHeaders(operation.operation, this.context)).map(
        (status): ResponseParameterInputInternal => [operation, status],
      )
    })
  }

  public referenceOf(input: ResponseParameterInput): TypeNode | undefined {
    if (isNil(input) || !Array.isArray(input)) {
      return undefined
    }
    return !this.hasResponsesHeaders(input)
      ? factory.createTypeReferenceNode('undefined')
      : factory.createTypeReferenceNode(this.context.nameOf(input, this.name()))
  }

  public dependenciesOf(fromPath: string, input: ResponseParameterInput): ImportDeclaration[] {
    return isNil(input) || !Array.isArray(input) || !this.hasResponsesHeaders(input)
      ? []
      : getModelImports(fromPath, this.name(), [input], this.context)
  }

  protected getEnhancedOperation([operation]: ResponseParameterInputInternal): EnhancedOperation {
    return operation
  }

  protected getNameable([{ operation }, statusCode]: ResponseParameterInputInternal) {
    return [operation, statusCode]
  }

  protected getParameterObjects([data, status]: ResponseParameterInputInternal): HeaderObject[] {
    return values(getResponseHeaders(data.operation, this.context)[status]).map((header) =>
      this.context.dereference(header, true),
    )
  }

  private hasResponsesHeaders([operation, status]: ResponseParameterInput) {
    const responseOrRef = (operation.responses ?? EmptyResponsesObject)[status]
    if (isNil(responseOrRef)) {
      return false
    }
    const response = this.context.dereference(responseOrRef, true)
    const headers = response.headers || {}
    return values(headers).length > 0
  }
}
