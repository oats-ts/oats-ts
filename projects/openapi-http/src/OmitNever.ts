/** Wraps an object types and omits fields typed as never */
export type OmmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
}
