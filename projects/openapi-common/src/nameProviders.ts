import pascalCase from 'pascalcase'
import camelCase from 'camelcase'
import { isNil } from 'lodash'
import { NameProvider, NameProviderHelper } from '@oats-ts/oats-ts'
import { DelegatingNameProviderInput, OpenAPIGeneratorTarget } from './typings'
import { OpenAPIObject, OperationObject } from '@oats-ts/openapi-model'

type NameProviderDelegate = (name: string, input: any, target: string, helper: NameProviderHelper) => string

const _delegating =
  (provider: NameProvider, ...delegates: NameProviderDelegate[]): NameProvider =>
  (input, target, helper) =>
    delegates.reduce((name, delegate) => delegate(name, input, target, helper), provider(input, target, helper))

const key: NameProvider = (input, target, helper) => {
  const name = helper.nameOf(input)
  if (isNil(name)) {
    throw new Error(`input has no name: ${JSON.stringify(input)}`)
  }
  return name
}

const operationId: NameProvider = (operation: OperationObject) => operation.operationId!

const documentTitle: NameProvider = (doc: OpenAPIObject) => pascalCase(doc.info?.title || '')

const toPascalCase: NameProviderDelegate = (name: string) => pascalCase(name)

const toCamelCase: NameProviderDelegate = (name: string) => camelCase(name)

const append =
  (suffix: string): NameProviderDelegate =>
  (name: string) =>
    `${name}${suffix}`

const prepend =
  (prefix: string): NameProviderDelegate =>
  (name: string) =>
    `${prefix}${name}`

const defaultDelegates: DelegatingNameProviderInput = {
  'json-schema/type': _delegating(key, toPascalCase),
  'json-schema/type-guard': _delegating(key, prepend('is-'), toCamelCase),
  'json-schema/type-validator': _delegating(key, toCamelCase, append('TypeValidator')),
  'openapi/operation': _delegating(operationId, toCamelCase),
  'openapi/query-type': _delegating(operationId, toPascalCase, append('QueryParameters')),
  'openapi/path-type': _delegating(operationId, toPascalCase, append('PathParameters')),
  'openapi/request-headers-type': _delegating(operationId, toPascalCase, append('RequestHeaderParameters')),
  'openapi/response-headers-type': (input: [OperationObject, string]) => {
    const [operation, status] = input
    return pascalCase(`${operation.operationId}${pascalCase(status)}ResponseHeaderParameters`)
  },
  'openapi/response-type': _delegating(operationId, toPascalCase, append('Response')),
  'openapi/request-type': _delegating(operationId, toPascalCase, append('Request')),
  'openapi/request-server-type': _delegating(operationId, toPascalCase, append('ServerRequest')),
  'openapi/path-serializer': _delegating(operationId, toCamelCase, append('PathSerializer')),
  'openapi/path-deserializer': _delegating(operationId, toCamelCase, append('PathDeserializer')),
  'openapi/query-serializer': _delegating(operationId, toCamelCase, append('QuerySerializer')),
  'openapi/query-deserializer': _delegating(operationId, toCamelCase, append('QueryDeserializer')),
  'openapi/request-headers-serializer': _delegating(operationId, toCamelCase, append('RequestHeadersSerializer')),
  'openapi/request-headers-deserializer': _delegating(operationId, toCamelCase, append('RequestHeadersDeserializer')),
  'openapi/response-headers-serializer': _delegating(operationId, toCamelCase, append('ResponseHeadersSerializer')),
  'openapi/response-headers-deserializer': _delegating(operationId, toCamelCase, append('ResponseHeadersDeserializer')),
  'openapi/request-body-validator': _delegating(operationId, toCamelCase, append('RequestBodyValidator')),
  'openapi/response-body-validator': _delegating(operationId, toCamelCase, append('ResponseBodyValidator')),
  'openapi/express-route': _delegating(operationId, toCamelCase, append('Router')),
  'openapi/sdk-type': _delegating(documentTitle, toPascalCase, append('Sdk')),
  'openapi/sdk-impl': _delegating(documentTitle, toPascalCase, append('SdkImpl')),
  'openapi/api-type': _delegating(documentTitle, toPascalCase, append('Api')),
  'openapi/express-route-factory': _delegating(documentTitle, toPascalCase, prepend('create'), append('Router')),
  'openapi/express-routes-type': _delegating(documentTitle, toPascalCase, append('Routers')),
  'openapi/express-cors-middleware': _delegating(documentTitle, toCamelCase, append('CorsMiddleware')),
}

export const nameProviders = {
  /**
   * Creates a name provider, respecting basic typescript naming conventions
   * @param delegates (optional) A generator target => delegate function mapping, use this for alternative naming
   * @returns The name provider
   */
  default(delegates: Partial<DelegatingNameProviderInput> = {}): NameProvider {
    return nameProviders.delegating({ ...defaultDelegates, ...delegates })
  },
  /**
   * Creates a name provider, that delegates the task for the appropriate name provider delegate
   * @param delegates The delegates, which is a generator target => delegate function mapping
   * @returns The name provider
   */
  delegating(delegates: DelegatingNameProviderInput): NameProvider {
    return (input: any, target: string, helper: NameProviderHelper): string => {
      const delegate = delegates[target as OpenAPIGeneratorTarget]
      if (isNil(delegate)) {
        throw new Error(`No name provider delegate found for "${target}}"`)
      }
      return delegate(input, target, helper)
    }
  },
}
