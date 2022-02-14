import { array, boolean, literal, number, object, optional, shape, string, tuple, union } from '@oats-ts/validators'

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
  | 'foo'
  | 'bar'
  | 2
  | 3
  | false
  | true
  | {
      foo: 'bar'
    }
  | {
      bar: 'foo'
    }
  | ['cat', 1]
  | {
      barfoo: 'fooo'
    }

export type PrimitiveTuple = [number, string, boolean?, 'hello'?]

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
  foo: literal('foo'),
  bar: literal('bar'),
  '2': literal(2),
  '3': literal(3),
  false: literal(false),
  true: literal(true),
  '{"foo":"bar"}': object(shape({ foo: literal('bar') })),
  '{"bar":"foo"}': object(shape({ bar: literal('foo') })),
  '["cat",1]': array(tuple(literal('cat'), literal(1))),
  '{"barfoo":"fooo"}': object(shape({ barfoo: literal('fooo') })),
})

export const primitiveTupleTypeValidator = array(
  tuple(number(), string(), optional(boolean()), optional(literal('hello'))),
)

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
    input === 'foo' ||
    input === 'bar' ||
    input === 2 ||
    input === 3 ||
    input === false ||
    input === true ||
    (typeof input === 'object' && typeof input !== null && input.foo === 'bar') ||
    (typeof input === 'object' && typeof input !== null && input.bar === 'foo') ||
    (Array.isArray(input) && input[0] === 'cat' && input[1] === 1) ||
    (typeof input === 'object' && typeof input !== null && input.barfoo === 'fooo')
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
