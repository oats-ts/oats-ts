export type LiteralType = 'cat'
export type EnumType = 'cat' | 'dog' | 'racoon'
export type MixedEnumType = 'cat' | true | 125

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

export type ComplexObj = {
  req: ObjType
  opt: OptObjType
}

export type StrField = { str: string }
export type OptStrField = { str?: string }
export type NumField = { num: number }
export type OptNumField = { num?: number }
export type BoolField = { bool: boolean }
export type OptBoolField = { bool?: boolean }
export type LitField = { lit: LiteralType }
export type OptLitField = { lit?: LiteralType }
export type EnmField = { enm: EnumType }
export type OptEnmField = { enm?: EnumType }
export type MixedEnmField = { enm: MixedEnumType }
export type OptMixedEnmField = { enm?: MixedEnumType }
export type NumArrField = { arr: number[] }
export type OptNumArrField = { arr?: number[] }
export type StrArrField = { arr: string[] }
export type OptStrArrField = { arr?: string[] }
export type BoolArrField = { arr: boolean[] }
export type OptBoolArrField = { arr?: boolean[] }
export type ObjField = { obj: ObjType }
export type OptObjField = { obj?: ObjType }
export type ObjFieldOpt = { obj: OptObjType }
export type OptObjFieldOpt = { obj?: OptObjType }
export type ComplexObjField = { obj: ComplexObj }
export type OptComplexObjField = { obj?: ComplexObj }

export type HStrField = { 'X-String-Field': string }
export type HOptStrField = { 'X-String-Field'?: string }
export type HNumField = { 'X-Number-Field': number }
export type HOptNumField = { 'X-Number-Field'?: number }
export type HBoolField = { 'X-Boolean-Field': boolean }
export type HOptBoolField = { 'X-Boolean-Field'?: boolean }
export type HEnmField = { 'X-Enum-Field': EnumType }
export type HOptEnmField = { 'X-Enum-Field'?: EnumType }
export type HMixedEnmField = { 'X-Enum-Field': MixedEnumType }
export type HOptMixedEnmField = { 'X-Enum-Field'?: MixedEnumType }
export type HLitField = { 'X-Lit-Field': LiteralType }
export type HOptLitField = { 'X-Lit-Field'?: LiteralType }
export type HNumArrField = { 'X-Arr-Field': number[] }
export type HObjField = { 'X-Obj-Field': ObjType }
export type HOptObjField = { 'X-Obj-Field'?: ObjType }
export type HObjOptField = { 'X-Obj-Field': OptObjType }
export type HComplexObjField = { 'X-Obj-Field': ComplexObj }
