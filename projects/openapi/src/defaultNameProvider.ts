import pascalCase from 'pascalcase'
import camelCase from 'camelcase'
import { OpenAPIGeneratorTarget } from './typings'
import { OperationObject } from '@oats-ts/openapi-model'
import { isNil } from 'lodash'

export function defaultNameProvider(input: any, name: string, target: OpenAPIGeneratorTarget): string {
  switch (target) {
    case 'openapi/type': {
      return isNil(name) ? undefined : pascalCase(name)
    }
    case 'openapi/type-guard': {
      return isNil(name) ? undefined : camelCase(`is-${name}`)
    }
    case 'openapi/operation': {
      const operation: OperationObject = input
      return isNil(operation.operationId) ? undefined : camelCase(operation.operationId)
    }
    case 'openapi/query-type': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}QueryParameters`)
    }
    case 'openapi/request-headers-type': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}RequestHeaderParameters`)
    }
    case 'openapi/path-type': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}PathParameters`)
    }
    case 'openapi/response-type': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}Response`)
    }
    case 'openapi/request-type': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}Request`)
    }
    case 'openapi/request-server-type': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}ServerRequest`)
    }
    case 'openapi/path-serializer': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${operationName}PathSerializer`
    }
    case 'openapi/query-serializer': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${operationName}QuerySerializer`
    }
    case 'openapi/request-headers-serializer': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${operationName}RequestHeadersSerializer`
    }
    case 'openapi/response-headers-serializer': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${operationName}ResponseHeaderSerializer`
    }
    case 'openapi/path-deserializer': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${operationName}PathDeserializer`
    }
    case 'openapi/query-deserializer': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${operationName}QueryDeserializer`
    }
    case 'openapi/request-headers-deserializer': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${operationName}RequestHeadersDeserializer`
    }
    case 'openapi/response-headers-deserializer': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${operationName}ResponseHeadersDeserializer`
    }
    case 'openapi/express-route': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${camelCase(operationName)}Route`
    }
    case 'openapi/type-validator': {
      return isNil(name) ? undefined : `${camelCase(name)}TypeValidator`
    }
    case 'openapi/request-body-validator': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${camelCase(operationName)}RequestBodyValidator`
    }
    case 'openapi/response-body-validator': {
      const operationName = defaultNameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${camelCase(operationName)}ResponseBodyValidator`
    }
    /**
     * No need to incorporate anything in the name as these should be singletons.
     * Change that in case multi-root schema generation is added.
     */
    case 'openapi/sdk-type': {
      return 'Sdk'
    }
    case 'openapi/sdk-stub': {
      return 'SdkStub'
    }
    case 'openapi/client-sdk': {
      return 'ClientSdk'
    }
    case 'openapi/api-type': {
      return 'Api'
    }
    case 'openapi/api-stub': {
      return 'ApiStub'
    }
    default:
      return name
  }
}
