import { isNil } from 'lodash'
import { OpenAPIGeneratorConfig } from '../typings'
import { defaultNameProvider } from './defaultNameProvider'

export function defaultOpenAPIGeneratorConfig(config: OpenAPIGeneratorConfig): OpenAPIGeneratorConfig {
  const { name, path } = config
  return {
    name: isNil(name) ? defaultNameProvider : name,
    path,
  }
}
