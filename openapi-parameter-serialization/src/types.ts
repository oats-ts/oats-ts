export type Primitive = string | number | boolean
export type PrimitiveArray = ReadonlyArray<Primitive>
export type PrimitiveRecord = Record<string, Primitive>
export type ParameterValue = Primitive | PrimitiveArray | PrimitiveRecord
export type ParameterObject = Record<string, ParameterValue>

export type Options<T> = {
  defaultValue?: T
  allowReserved?: boolean
  explode?: boolean
  required?: boolean
}

export type Serializer<T extends ParameterValue> = (name: string) => (value: T) => string[]
export type SerializerCreator<T extends ParameterValue> = (options: Options<T>) => Serializer<T>
