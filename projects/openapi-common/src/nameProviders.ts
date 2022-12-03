import pascalCase from 'pascalcase'
import camelCase from 'camelcase'
import { isNil } from 'lodash'
import { NameProvider, NameProviderHelper } from '@oats-ts/oats-ts'
import { DelegatingNameProviderInput, OpenAPIGeneratorTarget } from './typings'
import { OpenAPIObject, OperationObject } from '@oats-ts/openapi-model'
import { getOperationName as _getOperationName } from './getOperationName'
import { getSanitizedName } from './getSanitizedName'

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

const operationId: NameProvider = (operation: OperationObject, _target: string, helper: NameProviderHelper) => {
  return _getOperationName(operation, helper)
}

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
  'oats/type': _delegating(key, getSanitizedName, toPascalCase),
  'oats/type-guard': _delegating(key, getSanitizedName, prepend('is-'), toCamelCase),
  'oats/type-validator': _delegating(key, getSanitizedName, toCamelCase, append('TypeValidator')),
  'oats/operation': _delegating(operationId, toPascalCase, append('Operation')),
  'oats/query-type': _delegating(operationId, toPascalCase, append('QueryParameters')),
  'oats/path-type': _delegating(operationId, toPascalCase, append('PathParameters')),
  'oats/cookies-type': _delegating(operationId, toPascalCase, append('CookieParameters')),
  'oats/request-headers-type': _delegating(operationId, toPascalCase, append('RequestHeaderParameters')),
  'oats/response-headers-type': (input: [OperationObject, string], target: string, helper: NameProviderHelper) => {
    const [operation, status] = input
    return pascalCase(`${operationId(operation, target, helper)}${pascalCase(status)}ResponseHeaderParameters`)
  },
  'oats/response-type': _delegating(operationId, toPascalCase, append('Response')),
  'oats/response-server-type': _delegating(operationId, toPascalCase, append('ServerResponse')),
  'oats/request-type': _delegating(operationId, toPascalCase, append('Request')),
  'oats/request-server-type': _delegating(operationId, toPascalCase, append('ServerRequest')),
  'oats/request-body-validator': _delegating(operationId, toCamelCase, append('RequestBodyValidator')),
  'oats/response-body-validator': _delegating(operationId, toCamelCase, append('ResponseBodyValidator')),
  'oats/express-router-factory': _delegating(operationId, toPascalCase, prepend('create'), append('Router')),
  'oats/sdk-type': _delegating(documentTitle, getSanitizedName, toPascalCase, append('Sdk')),
  'oats/sdk-impl': _delegating(documentTitle, getSanitizedName, toPascalCase, append('SdkImpl')),
  'oats/api-type': _delegating(documentTitle, getSanitizedName, toPascalCase, append('Api')),
  'oats/cors-configuration': _delegating(documentTitle, getSanitizedName, toCamelCase, append('CorsConfiguration')),
  'oats/express-app-router-factory': _delegating(
    documentTitle,
    getSanitizedName,
    toPascalCase,
    prepend('create'),
    append('AppRouter'),
  ),
  'oats/express-router-factories-type': _delegating(
    documentTitle,
    getSanitizedName,
    toPascalCase,
    append('RouterFactories'),
  ),
  'oats/express-cors-router-factory': _delegating(
    documentTitle,
    getSanitizedName,
    toPascalCase,
    prepend('create'),
    append('CorsRouter'),
  ),
  'oats/express-context-router-factory': _delegating(
    documentTitle,
    toPascalCase,
    prepend('create'),
    append('ContextRouter'),
  ),
  'oats/cookie-parameters': _delegating(operationId, toCamelCase, append('CookieParameters')),
  'oats/path-parameters': _delegating(operationId, toCamelCase, append('PathParameters')),
  'oats/query-parameters': _delegating(operationId, toCamelCase, append('QueryParameters')),
  'oats/request-header-parameters': _delegating(operationId, toCamelCase, append('RequestHeaderParameters')),
  'oats/response-header-parameters': _delegating(operationId, toCamelCase, append('ResponseHeaderParameters')),
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
