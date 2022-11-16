import { OpenAPICodeGenerator } from '../types'
import { GroupGeneratorConfig } from './types'
import { OpenAPIGroupGenerator } from './OpenAPIGroupGenerator'

export const group = (config: GroupGeneratorConfig): OpenAPICodeGenerator => {
  const { name, children, ...globalConfig } = config
  return new OpenAPIGroupGenerator(name, Array.isArray(children) ? children : [children], globalConfig)
}
