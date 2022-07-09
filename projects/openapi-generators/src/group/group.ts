import { OpenAPIGenerator } from '../types'
import { GroupGeneratorConfig } from './types'
import { CompositeGenerator } from '@oats-ts/generator'

export const group = (config: GroupGeneratorConfig): OpenAPIGenerator => {
  const { name, children, ...globalConfig } = config
  return new CompositeGenerator(name, Array.isArray(children) ? children : [children], globalConfig)
}
