import { entries } from '../utils'
import { deserializers } from './deserializers'
import { DslLocation, DslRoot, DslStyle, ParameterType } from './types'

export function createDeserializer<T extends ParameterType, L extends DslLocation, S extends DslStyle>(
  root: DslRoot<T, L, S>,
) {
  const kvPairs = entries(root).map(([key, dsl]) => {
    const deserializer = deserializers[dsl.location]?.[dsl.style]?.[dsl.type]
  })
}
