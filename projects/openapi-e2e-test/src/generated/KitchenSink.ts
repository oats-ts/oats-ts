import {
  any,
  array,
  boolean,
  lazy,
  literal,
  number,
  object,
  optional,
  shape,
  string,
  tuple,
  union,
} from '@oats-ts/validators'

export type IgnoredInternals = {
  additionalProps?: Record<string, string>
  arrayItems?: string[]
  primitive?: number
  reference?: TupleMessage1
}

export type Leaf1 = {
  type: 'Leaf1'
  leaf1?: true
}

export type Leaf2 = {
  type: 'Leaf2'
  leaf2?: true
}

export type Leaf3 = {
  type: 'Leaf3'
  leaf3?: true
}

export type Mid = Leaf1 | Leaf2

export type ObjectConst = {
  null: null
  str: 'bar'
  num: 12
  bool: false
  array: [1, 'asd', true]
  nested: {
    secondLevel: {
      thirdLevel: {}
    }
  }
}

export type ObjectEnum =
  | null
  | 'bar'
  | 3
  | true
  | {
      foo: 'bar'
    }
  | ['cat']

export type PrimitiveTuple = [number, string, boolean?, 'hello'?]

export type SingleValueEnums = {
  bool?: true
  num?: 1
  obj: {
    asd: 'foo'
  }
  str: 'A'
}

export type Top = Mid | Leaf3

export type TupleMessage = TupleMessage1 | TupleMessage2

export type TupleMessage1 = [
  'message-1',
  {
    foo?: string
  },
]

export type TupleMessage2 = [
  'message-2',
  {
    bar?: string
  },
]

export const ignoredInternalsTypeValidator = object(
  shape({
    additionalProps: optional(object()),
    arrayItems: optional(array()),
    primitive: optional(any),
    reference: optional(any),
  }),
)

export const leaf1TypeValidator = object(
  shape({
    type: literal('Leaf1'),
    leaf1: optional(literal(true)),
  }),
)

export const leaf2TypeValidator = object(
  shape({
    type: literal('Leaf2'),
    leaf2: optional(literal(true)),
  }),
)

export const leaf3TypeValidator = object(
  shape({
    type: literal('Leaf3'),
    leaf3: optional(literal(true)),
  }),
)

export const midTypeValidator = union({
  Leaf1: lazy(() => leaf1TypeValidator),
  Leaf2: lazy(() => leaf2TypeValidator),
})

export const objectConstTypeValidator = object(
  shape({
    null: literal(null),
    str: literal('bar'),
    num: literal(12),
    bool: literal(false),
    array: array(tuple(literal(1), literal('asd'), literal(true))),
    nested: object(shape({ secondLevel: object(shape({ thirdLevel: object(shape({})) })) })),
  }),
)

export const objectEnumTypeValidator = union({
  null: literal(null),
  bar: literal('bar'),
  '3': literal(3),
  true: literal(true),
  '{"foo":"bar"}': object(shape({ foo: literal('bar') })),
  '["cat"]': array(tuple(literal('cat'))),
})

export const primitiveTupleTypeValidator = array(
  tuple(number(), string(), optional(boolean()), optional(literal('hello'))),
)

export const singleValueEnumsTypeValidator = object(
  shape({
    bool: optional(literal(true)),
    num: optional(literal(1)),
    obj: object(shape({ asd: literal('foo') })),
    str: literal('A'),
  }),
)

export const topTypeValidator = union({
  Mid: lazy(() => midTypeValidator),
  Leaf3: lazy(() => leaf3TypeValidator),
})

export const tupleMessage1TypeValidator = array(tuple(literal('message-1'), object(shape({ foo: optional(string()) }))))

export const tupleMessage2TypeValidator = array(tuple(literal('message-2'), object(shape({ bar: optional(string()) }))))

export const tupleMessageTypeValidator = union({
  TupleMessage1: lazy(() => tupleMessage1TypeValidator),
  TupleMessage2: lazy(() => tupleMessage2TypeValidator),
})

export function isIgnoredInternals(input: any): input is IgnoredInternals {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.additionalProps === null ||
      input.additionalProps === undefined ||
      (input.additionalProps !== null && typeof input.additionalProps === 'object')) &&
    (input.arrayItems === null || input.arrayItems === undefined || Array.isArray(input.arrayItems))
  )
}

export function isLeaf1(input: any): input is Leaf1 {
  return (
    input !== null &&
    typeof input === 'object' &&
    input.type === 'Leaf1' &&
    (input.leaf1 === null || input.leaf1 === undefined || input.leaf1 === true)
  )
}

export function isLeaf2(input: any): input is Leaf2 {
  return (
    input !== null &&
    typeof input === 'object' &&
    input.type === 'Leaf2' &&
    (input.leaf2 === null || input.leaf2 === undefined || input.leaf2 === true)
  )
}

export function isLeaf3(input: any): input is Leaf3 {
  return (
    input !== null &&
    typeof input === 'object' &&
    input.type === 'Leaf3' &&
    (input.leaf3 === null || input.leaf3 === undefined || input.leaf3 === true)
  )
}

export function isMid(input: any): input is Mid {
  return isLeaf1(input) || isLeaf2(input)
}

export function isObjectConst(input: any): input is ObjectConst {
  return (
    typeof input === 'object' &&
    typeof input !== null &&
    input['null'] === null &&
    input.str === 'bar' &&
    input.num === 12 &&
    input.bool === false &&
    Array.isArray(input.array) &&
    input.array[0] === 1 &&
    input.array[1] === 'asd' &&
    input.array[2] === true &&
    typeof input.nested === 'object' &&
    typeof input.nested !== null &&
    typeof input.nested.secondLevel === 'object' &&
    typeof input.nested.secondLevel !== null &&
    typeof input.nested.secondLevel.thirdLevel === 'object' &&
    typeof input.nested.secondLevel.thirdLevel !== null
  )
}

export function isObjectEnum(input: any): input is ObjectEnum {
  return (
    input === null ||
    input === 'bar' ||
    input === 3 ||
    input === true ||
    (typeof input === 'object' && typeof input !== null && input.foo === 'bar') ||
    (Array.isArray(input) && input[0] === 'cat')
  )
}

export function isPrimitiveTuple(input: any): input is PrimitiveTuple {
  return (
    Array.isArray(input) &&
    typeof input[0] === 'number' &&
    typeof input[1] === 'string' &&
    (input[2] === null || input[2] === undefined || typeof input[2] === 'boolean') &&
    (input[3] === null || input[3] === undefined || input[3] === 'hello')
  )
}

export function isSingleValueEnums(input: any): input is SingleValueEnums {
  return (
    input !== null &&
    typeof input === 'object' &&
    (input.bool === null || input.bool === undefined || input.bool === true) &&
    (input.num === null || input.num === undefined || input.num === 1) &&
    typeof input.obj === 'object' &&
    typeof input.obj !== null &&
    input.obj.asd === 'foo' &&
    input.str === 'A'
  )
}

export function isTop(input: any): input is Top {
  return isMid(input) || isLeaf3(input)
}

export function isTupleMessage(input: any): input is TupleMessage {
  return isTupleMessage1(input) || isTupleMessage2(input)
}

export function isTupleMessage1(input: any): input is TupleMessage1 {
  return (
    Array.isArray(input) &&
    input[0] === 'message-1' &&
    input[1] !== null &&
    typeof input[1] === 'object' &&
    (input[1].foo === null || input[1].foo === undefined || typeof input[1].foo === 'string')
  )
}

export function isTupleMessage2(input: any): input is TupleMessage2 {
  return (
    Array.isArray(input) &&
    input[0] === 'message-2' &&
    input[1] !== null &&
    typeof input[1] === 'object' &&
    (input[1].bar === null || input[1].bar === undefined || typeof input[1].bar === 'string')
  )
}
