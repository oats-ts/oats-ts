import pascalCase from 'pascalcase'
import camelCase from 'camelcase'
import { OpenAPIGeneratorTarget } from './typings'
import { OperationObject } from 'openapi3-ts'
import { isNil } from 'lodash'

export function nameProvider(input: any, name: string, target: OpenAPIGeneratorTarget): string {
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
      const operationName = nameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}QueryParameters`)
    }
    case 'openapi/headers-type': {
      const operationName = nameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}HeaderParameters`)
    }
    case 'openapi/path-type': {
      const operationName = nameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}PathParameters`)
    }
    case 'openapi/response-type': {
      const operationName = nameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}Response`)
    }
    case 'openapi/input-type': {
      const operationName = nameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}Input`)
    }
    case 'openapi/path-serializer': {
      const operationName = nameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${operationName}PathSerializer`
    }
    case 'openapi/query-serializer': {
      const operationName = nameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${operationName}QuerySerializer`
    }
    case 'openapi/headers-serializer': {
      const operationName = nameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${operationName}HeadersSerializer`
    }
    case 'openapi/expectations': {
      const operationName = nameProvider(input, name, 'openapi/operation')
      return isNil(operationName) ? undefined : `${operationName}Expectations`
    }
    /**
     * No need to incorporate anything in the name as these should be singletons.
     * Change that in case multi-root schema generation is added.
     */
    case 'openapi/api-type': {
      return 'Api'
    }
    case 'openapi/api-class': {
      return 'ApiImpl'
    }
    case 'openapi/api-stub': {
      return 'ApiStub'
    }
    case 'openapi/validator': {
      return isNil(name) ? undefined : `${camelCase(name)}Validator`
    }
    default:
      return name
  }
}