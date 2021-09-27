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

export type StringFieldObj = {
  foo: string
}

export type NumberFieldObj = {
  foo: number
}

export type BooleanFieldObj = {
  foo: boolean
}

export type LiteralFieldObj = {
  foo: LiteralType
}

export type EnumFieldObj = {
  foo: EnumType
}

export type ObjectFieldObj = {
  foo: ObjType
}

export type OptObjectFieldObj = {
  foo: OptObjType
}

export type NumberArrayFieldObj = {
  foo: number[]
}

export type EnumArrayFieldObj = {
  foo: EnumType[]
}
