import { datatype } from 'faker'

export function arrayOf<T>(producer: () => T): T[] {
  return datatype.array(datatype.number({ min: 1, max: 10 })).map(producer)
}

export function optional<T>(producer: () => T): T | undefined {
  return datatype.boolean() ? producer() : undefined
}
