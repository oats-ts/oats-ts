/** Common */
export type Primitive = string | number | boolean
export type PrimitiveArray = ReadonlyArray<Primitive>
export type PrimitiveRecord = Record<string, Primitive>
export type ParameterValue = Primitive | PrimitiveArray | PrimitiveRecord

export type ParameterObject = Record<string, ParameterValue>

/** Query */
export type QueryOptions<T> = {
  defaultValue?: T
  allowReserved?: boolean
  explode?: boolean
  required?: boolean
}

export type QuerySerializer<T extends ParameterValue> = (name: string) => (value: T) => string[]
export type QuerySerializerCreator<T extends ParameterValue> = (options: QueryOptions<T>) => QuerySerializer<T>
export type QuerySerializers<T extends ParameterObject> = { [P in keyof T]: QuerySerializer<T[P]> }

/** Path */
export type PathOptions<T> = {
  defaultValue?: T
  explode?: boolean
}

export type PathSerializer<T extends ParameterValue> = (name: string) => (value: T) => string
export type PathSerializerCreator<T extends ParameterValue> = (options: PathOptions<T>) => PathSerializer<T>
export type PathSerializers<T extends ParameterObject> = { [P in keyof T]: PathSerializer<T[P]> }

/** Path parsing */
export type ParameterSegment = {
  type: 'parameter'
  name: string
}

export type TextSegment = {
  type: 'text'
  value: string
}

export type PathSegment = ParameterSegment | TextSegment

/** Header */
export type HeaderOptions<T> = {
  defaultValue?: T
  explode?: boolean
  required?: boolean
}

export type HeaderSerializer<T extends ParameterValue> = (name: string) => (value: T) => string
export type HeaderSerializerCreator<T extends ParameterValue> = (options: HeaderOptions<T>) => HeaderSerializer<T>
export type HeaderSerializers<T extends ParameterObject> = { [P in keyof T]: HeaderSerializer<T[P]> }
