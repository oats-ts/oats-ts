import pascalCase from 'pascalcase'
import camelCase from 'camelcase'
import isNil from 'lodash/isNil'

export function defaultNameProvider(input: any, name: string, target: string): string {
  if (isNil(name)) {
    return undefined
  }
  switch (target) {
    case 'schema':
      return pascalCase(name)
    case 'operation':
      return camelCase(name)
    default:
      return name
  }
}
