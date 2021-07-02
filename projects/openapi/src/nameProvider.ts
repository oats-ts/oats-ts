import pascalCase from 'pascalcase'
import camelCase from 'camelcase'
import { OpenAPIGeneratorTarget } from './typings'
import { OperationObject } from 'openapi3-ts'
import { isNil } from 'lodash'

export function nameProvider(input: any, name: string, target: OpenAPIGeneratorTarget): string {
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
      const operationName = nameProvider(input, name, 'operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}QueryParameters`)
    }
    case 'operation-headers-type': {
      const operationName = nameProvider(input, name, 'operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}HeaderParameters`)
    }
    case 'operation-path-type': {
      const operationName = nameProvider(input, name, 'operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}PathParameters`)
    }
    case 'operation-response-type': {
      const operationName = nameProvider(input, name, 'operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}Response`)
    }
    case 'operation-input-type': {
      const operationName = nameProvider(input, name, 'operation')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}Input`)
    }
    case 'operation-path-serializer': {
      const operationName = nameProvider(input, name, 'operation')
      return isNil(operationName) ? undefined : `${operationName}PathSerializer`
    }
    case 'operation-query-serializer': {
      const operationName = nameProvider(input, name, 'operation')
      return isNil(operationName) ? undefined : `${operationName}QuerySerializer`
    }
    case 'operation-headers-serializer': {
      const operationName = nameProvider(input, name, 'operation')
      return isNil(operationName) ? undefined : `${operationName}HeadersSerializer`
    }
    case 'operation-response-parser-hint': {
      const operationName = nameProvider(input, name, 'operation')
      return isNil(operationName) ? undefined : `${operationName}ParserHint`
    }
    /**
     * No need to incorporate anything in the name as these should be singletons.
     * Change that in case multi-root schema generation is added.
     */
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
      return isNil(name) ? undefined : `${camelCase(name)}Validator`
    }
    default:
      return name
  }
}
