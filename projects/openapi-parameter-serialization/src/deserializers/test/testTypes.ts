export type LiteralType = 'cat'
export type EnumType = 'cat' | 'dog' | 'racoon'

export type ObjType = {
  s: string
  n: number
  b: boolean
  l: LiteralType
  e: EnumType
}

export type OptObjType = {
  s?: string
  n?: number
  b?: boolean
  l?: LiteralType
  e?: EnumType
}

export type AnyFieldObj = {
  value?: any
}

export type StringFieldObj = {
  value: string
}

export type NumberFieldObj = {
  value: number
}

export type BooleanFieldObj = {
  value: boolean
}

export type LiteralFieldObj = {
  value: LiteralType
}

export type EnumFieldObj = {
  value: EnumType
}

export type ObjectFieldObj = {
  value: ObjType
}

export type OptObjectFieldObj = {
  value: OptObjType
}

export type StringArrayFieldObj = {
  value: string[]
}

export type NumberArrayFieldObj = {
  value: number[]
}

export type BooleanArrayFieldObj = {
  value: boolean[]
}

export type LiteralArrayFieldObj = {
  value: LiteralType[]
}

export type EnumArrayFieldObj = {
  value: EnumType[]
}

export type PrimitiveTypesObject<T> = {
  string?: T
  number?: T
  boolean?: T
  literal?: T
  enumeration?: T
}

export type ObjectTypesObject<T> = {
  requiredFields?: T
  optionalFields?: T
}

export type TypesObject<T> = {
  primitive?: PrimitiveTypesObject<T>
  array?: PrimitiveTypesObject<T>
  object?: ObjectTypesObject<T>
}

export type StyleObject<T> = {
  required?: TypesObject<T>
  optional?: TypesObject<T>
}

export type TestDataObject<T> = {
  explode?: StyleObject<T>
  noExplode?: StyleObject<T>
}

export type TestFactory<F, D> = (name: string, fn: F, data: D) => void
