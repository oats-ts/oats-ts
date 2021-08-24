import pascalCase from 'pascalcase'
import camelCase from 'camelcase'
import { AsyncAPIGeneratorTarget } from './typings'
import { isNil, negate } from 'lodash'
import { ChannelItemObject } from '@oats-ts/asyncapi-model'

const nonNil = negate(isNil)

export function nameProvider(input: any, name: string, target: AsyncAPIGeneratorTarget): string {
  switch (target) {
    case 'asyncapi/type': {
      return isNil(name) ? undefined : pascalCase(name)
    }
    case 'asyncapi/type-guard': {
      return isNil(name) ? undefined : camelCase(`is-${name}`)
    }
    case 'asyncapi/channel': {
      const channel: ChannelItemObject = input
      if (isNil(channel)) {
        return undefined
      }
      if (!isNil(channel.name)) {
        return camelCase(channel.name)
      }
      return [channel.subscribe?.operationId, channel.publish?.operationId].filter(nonNil).map(pascalCase).join('')
    }
    case 'asyncapi/query-type': {
      const operationName = nameProvider(input, name, 'asyncapi/channel')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}QueryParameters`)
    }
    case 'asyncapi/path-type': {
      const operationName = nameProvider(input, name, 'asyncapi/channel')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}PathParameters`)
    }
    case 'asyncapi/subscribe-type': {
      const operationName = nameProvider(input, name, 'asyncapi/channel')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}SubType`)
    }
    case 'asyncapi/publish-type': {
      const operationName = nameProvider(input, name, 'asyncapi/channel')
      return isNil(operationName) ? undefined : pascalCase(`${operationName}PubType`)
    }
    case 'asyncapi/path-serializer': {
      const operationName = nameProvider(input, name, 'asyncapi/channel')
      return isNil(operationName) ? undefined : `${operationName}PathSerializer`
    }
    case 'asyncapi/query-serializer': {
      const operationName = nameProvider(input, name, 'asyncapi/channel')
      return isNil(operationName) ? undefined : `${operationName}QuerySerializer`
    }
    /**
     * No need to incorporate anything in the name as these should be singletons.
     * Change that in case multi-root schema generation is added.
     */
    case 'asyncapi/api-type': {
      return 'Api'
    }
    case 'asyncapi/api-class': {
      return 'ApiImpl'
    }
    case 'asyncapi/api-stub': {
      return 'ApiStub'
    }
    case 'asyncapi/validator': {
      return isNil(name) ? undefined : `${camelCase(name)}Validator`
    }
    default:
      return name
  }
}
