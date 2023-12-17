import {
  EnumType,
  ObjectWithArrays,
  ObjectWithNestedObjects,
  ObjectWithNullablePrimitives,
  ObjectWithPrimitives,
  PrimitiveOptionalTupleType,
  PrimitiveTupleType,
} from '../../generated/bodies/types'
import { random } from '../common/random'

const enumValues: EnumType[] = ['A', 'B', 'C']

export function randomEnum(): EnumType {
  return random.arrayElement(enumValues)
}

export function randomObjectWithPrimitives(): ObjectWithPrimitives {
  return {
    str: random.string(),
    num: random.number(),
    lit: 'Literal Value',
    bool: random.boolean(),
    enm: randomEnum(),
  }
}

export function randomObjectWithNullablePrimitives(): ObjectWithNullablePrimitives {
  return {
    nullableStr: random.boolean() ? random.string() : null,
    nullableNum: random.boolean() ? random.number() : null,
    nullableBool: random.boolean() ? random.boolean() : null,
    nullableLit: random.boolean() ? 'Literal Value' : null,
  }
}

export function randomObjectWithArrays(): ObjectWithArrays {
  return {
    strArr: random.arrayOf(() => random.string()),
    numArr: random.arrayOf(() => random.number()),
    boolArr: random.arrayOf(() => random.boolean()),
    enmArr: random.arrayOf(randomEnum),
  }
}

export function randomObjectWithNestedObjects(): ObjectWithNestedObjects {
  return {
    arrObj: randomObjectWithArrays(),
    primObj: randomObjectWithPrimitives(),
    nullablePrimObj: randomObjectWithNullablePrimitives(),
  }
}

export function randomTuple(): PrimitiveTupleType {
  return ['Literal Value', random.string(), random.number(), randomEnum(), random.boolean()]
}

export function randomOptionalTuple(): PrimitiveOptionalTupleType {
  return randomTuple().slice(0, random.number()) as PrimitiveOptionalTupleType
}
