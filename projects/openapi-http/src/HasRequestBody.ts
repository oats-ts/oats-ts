export type HasRequestBody<C extends string, T> = {
  mimeType: C
  body: T
}
