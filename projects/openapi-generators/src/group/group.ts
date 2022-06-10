import { flattenChildren } from '../utils/flattenChildren'
import { GroupGenerator } from './GroupGenerator'
import { OpenAPIGenerator } from '../types'
import { GroupGeneratorConfig } from './types'

export const group =
  (config: GroupGeneratorConfig) =>
  (...children: (OpenAPIGenerator | OpenAPIGenerator[])[]): GroupGenerator => {
    const { name, ...globalConfig } = config
    return new GroupGenerator(name, flattenChildren(children), globalConfig)
  }
