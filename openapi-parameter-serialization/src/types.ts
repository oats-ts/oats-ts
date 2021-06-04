export type Primitive = string | number | boolean
export type PrimitiveArray = ReadonlyArray<Primitive>
export type PrimitiveRecord = Record<string, Primitive>
export type ParameterValue = Primitive | PrimitiveArray | PrimitiveRecord

export type Options<T> = {
  defaultValue?: T
  encode?: boolean
  explode?: boolean
  allowEmpty?: boolean
  required?: boolean
}

export type Serializer = (name: string) => (value: ParameterValue) => string
