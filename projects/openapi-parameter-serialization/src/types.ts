/** Types that can be individual parameter values */
export type Primitive = string | number | boolean
export type PrimitiveArray = ReadonlyArray<Primitive>
export type PrimitiveRecord = Record<string, Primitive>

/** Union type for above */
export type ParameterValue = Primitive | PrimitiveArray | PrimitiveRecord

/** Object, collection of named parameter values */
export type ParameterObject = Record<string, ParameterValue>

/** Query related types */
export type QueryOptions<T> = {
  defaultValue?: T
  explode?: boolean
  required?: boolean
}

export type QuerySerializer<T extends ParameterValue | undefined> = (name: string) => (value?: T) => string[]
export type QuerySerializers<T extends ParameterObject> = { [P in keyof T]: QuerySerializer<T[P]> }

/** Path related types */
export type PathOptions<T> = {
  defaultValue?: T
  explode?: boolean
}

export type PathSerializer<T extends ParameterValue | undefined> = (name: string) => (value: T) => string
export type PathSerializers<T extends ParameterObject> = { [P in keyof T]: PathSerializer<T[P]> }

/** Header related types */
export type HeaderOptions<T> = {
  defaultValue?: T
  explode?: boolean
  required?: boolean
}

export type HeaderSerializer<T extends ParameterValue | undefined> = (name: string) => (value?: T) => string
export type HeaderSerializers<T extends ParameterObject> = { [P in keyof T]: HeaderSerializer<T[P]> }
