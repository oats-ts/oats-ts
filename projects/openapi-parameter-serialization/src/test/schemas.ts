import { validators } from '@oats-ts/validators'
import { array, items } from '@oats-ts/validators/lib/factories'
import {
  BoolField,
  ComplexObj,
  ComplexObjField,
  EnmField,
  HBoolField,
  HComplexObjField,
  HEnmField,
  HLitField,
  HNumArrField,
  HNumField,
  HObjField,
  HObjOptField,
  HOptBoolField,
  HOptEnmField,
  HOptLitField,
  HOptNumField,
  HOptObjField,
  HOptStrField,
  HStrField,
  LitField,
  NumArrField,
  NumField,
  ObjField,
  ObjType,
  OptBoolField,
  OptEnmField,
  OptLitField,
  OptNumField,
  OptObjType,
  OptStrArrField,
  OptStrField,
  StrArrField,
  StrField,
} from './model'

const { object, shape, optional, string, boolean, number, union, literal } = validators

export const enumSchema = union({
  cat: literal('cat'),
  dog: literal('dog'),
  racoon: literal('racoon'),
})
export const mixedEnumSchema = union({
  cat: literal('cat'),
  true: literal(true),
  125: literal(125),
})

export const litSchema = literal('cat')

export const objSchema = object(
  shape<ObjType>({
    b: boolean(),
    e: enumSchema,
    l: litSchema,
    n: number(),
    s: string(),
  }),
)

export const optObjSchema = object(
  shape<OptObjType>({
    b: optional(boolean()),
    e: optional(enumSchema),
    l: optional(litSchema),
    n: optional(number()),
    s: optional(string()),
  }),
)

export const complexObjSchema = object(
  shape<ComplexObj>({
    opt: optObjSchema,
    req: objSchema,
  }),
)

export const strFieldSchema = object(shape<StrField>({ str: string() }))
export const optStrFieldSchema = object(shape<OptStrField>({ str: optional(string()) }))
export const numFieldSchema = object(shape<NumField>({ num: number() }))
export const optNumFieldSchema = object(shape<OptNumField>({ num: optional(number()) }))
export const boolFieldSchema = object(shape<BoolField>({ bool: boolean() }))
export const optBoolFieldSchema = object(shape<OptBoolField>({ bool: optional(boolean()) }))
export const litFieldSchema = object(shape<LitField>({ lit: litSchema }))
export const optLitFieldSchema = object(shape<OptLitField>({ lit: optional(litSchema) }))
export const enmFieldSchema = object(shape<EnmField>({ enm: enumSchema }))
export const optEnmFieldSchema = object(shape<OptEnmField>({ enm: optional(enumSchema) }))
export const mixedEnmFieldSchema = object(shape<EnmField>({ enm: mixedEnumSchema }))
export const optMixedEnmFieldSchema = object(shape<OptEnmField>({ enm: optional(mixedEnumSchema) }))
export const strArrFieldSchema = object(shape<StrArrField>({ arr: array(items(string())) }))
export const optStrArrFieldSchema = object(shape<OptStrArrField>({ arr: optional(array(items(string()))) }))
export const numArrFieldSchema = object(shape<NumArrField>({ arr: array(items(number())) }))
export const optNumArrFieldSchema = object(shape<OptStrArrField>({ arr: optional(array(items(number()))) }))
export const boolArrFieldSchema = object(shape<StrArrField>({ arr: array(items(boolean())) }))
export const optBoolArrFieldSchema = object(shape<OptStrArrField>({ arr: optional(array(items(boolean()))) }))
export const objFieldSchema = object(shape<ObjField>({ obj: objSchema }))
export const optObjFieldSchema = object(shape<ObjField>({ obj: optional(objSchema) }))
export const objFieldOptSchema = object(shape<ObjField>({ obj: optObjSchema }))
export const optObjFieldOptSchema = object(shape<ObjField>({ obj: optional(optObjSchema) }))
export const complexObjFieldSchema = object(shape<ComplexObjField>({ obj: complexObjSchema }))
export const optComplexObjFieldSchema = object(shape<ObjField>({ obj: optional(complexObjSchema) }))

export const hStrFieldSchema = object(shape<HStrField>({ 'X-String-Field': string() }))
export const hOptStrFieldSchema = object(shape<HOptStrField>({ 'X-String-Field': optional(string()) }))
export const hNumFieldSchema = object(shape<HNumField>({ 'X-Number-Field': number() }))
export const hOptNumFieldSchema = object(shape<HOptNumField>({ 'X-Number-Field': optional(number()) }))
export const hBoolFieldSchema = object(shape<HBoolField>({ 'X-Boolean-Field': boolean() }))
export const hOptBoolFieldSchema = object(shape<HOptBoolField>({ 'X-Boolean-Field': optional(boolean()) }))
export const hEnmFieldSchema = object(shape<HEnmField>({ 'X-Enum-Field': enumSchema }))
export const hOptEnmFieldSchema = object(shape<HOptEnmField>({ 'X-Enum-Field': optional(enumSchema) }))
export const hMixedEnmFieldSchema = object(shape<HEnmField>({ 'X-Enum-Field': mixedEnumSchema }))
export const hOptMixedEnmFieldSchema = object(shape<HOptEnmField>({ 'X-Enum-Field': optional(mixedEnumSchema) }))
export const hLitFieldSchema = object(shape<HLitField>({ 'X-Lit-Field': litSchema }))
export const hOptLitFieldSchema = object(shape<HOptLitField>({ 'X-Lit-Field': optional(litSchema) }))
export const hNumArrFieldSchema = object(shape<HNumArrField>({ 'X-Arr-Field': array(items(number())) }))
export const hObjFieldSchema = object(shape<HObjField>({ 'X-Obj-Field': objSchema }))
export const hOptObjFieldSchema = object(shape<HOptObjField>({ 'X-Obj-Field': optional(objSchema) }))
export const hObjFieldOptSchema = object(shape<HObjOptField>({ 'X-Obj-Field': optObjSchema }))
export const hComplexObjSchema = object(shape<HComplexObjField>({ 'X-Obj-Field': complexObjSchema }))
