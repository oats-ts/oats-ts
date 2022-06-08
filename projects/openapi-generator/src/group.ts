import { flattenChildren } from './flattenChildren'
import { GroupGenerator } from './GroupGenerator'
import { GroupGeneratorConfig, OAGen } from './types'

export const group =
  (config: GroupGeneratorConfig) =>
  (...children: (OAGen | OAGen[])[]): GroupGenerator => {
    const { name, ...globalConfig } = config
    return new GroupGenerator(name, flattenChildren(children), globalConfig)
  }
