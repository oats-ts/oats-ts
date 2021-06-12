/** So we don't depend on browser Headers. */
export type IterableHeaders = {
  forEach(callbackfn: (value: string, key: string) => void): void
  get(key: string): string
  has(key: string): boolean
}

export type HeadersInitLike = IterableHeaders | string[][] | Record<string, string>

export type ResponseLike = {
  readonly headers: IterableHeaders
  readonly status: number
  readonly url: string
  arrayBuffer(): Promise<any>
  blob(): Promise<any>
  json(): Promise<any>
  text(): Promise<string>
}
