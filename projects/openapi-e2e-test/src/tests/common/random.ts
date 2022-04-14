const alphabet = '012345678910ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-'

export const random = {
  number: (minInclusive: number = 0, maxExclusive: number = Number.MAX_SAFE_INTEGER): number => {
    return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive
  },
  boolean: (): boolean => {
    return Math.random() > 0.5
  },
  string(): string {
    return random.arrayOf(() => alphabet[random.number(0, alphabet.length)]).join('')
  },
  arrayOf: <T>(producer: () => T): T[] => {
    return new Array(random.length()).fill(1).map(() => producer())
  },
  arrayElement: <T>(array: T[]): T => {
    return array[random.number(0, array.length)]!
  },
  length: (): number => {
    return random.number(2, 10)
  },
  optional: <T>(producer: () => T): T | undefined => {
    return random.boolean() ? producer() : undefined
  },
} as const
