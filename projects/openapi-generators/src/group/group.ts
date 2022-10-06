import { OpenAPIGenerator } from '../types'
import { GroupGeneratorConfig } from './types'
import { GroupGenerator } from '@oats-ts/oats-ts'

export const group = (config: GroupGeneratorConfig): OpenAPIGenerator => {
  const { name, children, ...globalConfig } = config
  return new GroupGenerator(name, Array.isArray(children) ? children : [children], globalConfig)
}
