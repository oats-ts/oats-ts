export function entries<K extends string, V>(input: Record<K, V>): [K, V][] {
  return Object.keys(input).map((key: string) => [key as K, input[key as K] as V])
}
