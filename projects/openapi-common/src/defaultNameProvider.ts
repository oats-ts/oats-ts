import pascalCase from 'pascalcase'
import camelCase from 'camelcase'
import { OpenAPIGeneratorTarget } from './typings'
import { OperationObject } from 'openapi3-ts'
import { isNil } from 'lodash'

export function defaultNameProvider(input: any, name: string, target: OpenAPIGeneratorTarget): string {
  switch (target) {
    case 'type': {
      return isNil(name) ? undefined : pascalCase(name)
    }
    case 'type-guard': {
      return isNil(name) ? undefined : camelCase(`is-${name}`)
    }
    case 'operation': {
      const operation: OperationObject = input
      return isNil(operation.operationId) ? undefined : camelCase(operation.operationId)
    }
    case 'operation-query-type': {
      const operationName = defaultNameProvider(input, name, 'operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}QueryParameters`)
    }
    case 'operation-headers-type': {
      const operationName = defaultNameProvider(input, name, 'operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}HeaderParameters`)
    }
    case 'operation-path-type': {
      const operationName = defaultNameProvider(input, name, 'operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}PathParameters`)
    }
    case 'operation-response-type': {
      const operationName = defaultNameProvider(input, name, 'operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}Response`)
    }
    case 'operation-input-type': {
      const operationName = defaultNameProvider(input, name, 'operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}Input`)
    }
    // TODO does it need to be named based on operation?
    case 'operation-path-serializer': {
      return 'pathSerializer'
    }
    case 'operation-query-serializer': {
      return 'querySerializer'
    }
    case 'operation-headers-serializer': {
      return 'headersSerializer'
    }
    case 'operation-response-parser-hint': {
      return 'responseParserHint'
    }
    case 'api-type': {
      return 'Api'
    }
    case 'api-class': {
      return 'ApiImpl'
    }
    case 'api-stub': {
      return 'ApiStub'
    }
    case 'validator': {
      return `${camelCase(name)}Validator`
    }
    default:
      return name
  }
}
