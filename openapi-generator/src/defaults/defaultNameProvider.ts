import pascalCase from 'pascalcase'
import camelCase from 'camelcase'
import { OpenAPIGeneratorTarget } from '../typings'
import { OperationObject } from '@oats-ts/openapi-reader/node_modules/openapi3-ts'

export function defaultNameProvider(input: any, name: string, target: OpenAPIGeneratorTarget): string {
  switch (target) {
    case 'type':
      return pascalCase(name)
    case 'operation':
      return camelCase((input as OperationObject).operationId || name)
    default:
      return name
  }
}
