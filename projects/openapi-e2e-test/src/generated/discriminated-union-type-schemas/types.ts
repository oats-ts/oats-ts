/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/schemas/discriminated-union-type-schemas.json
 */

export type LeafType1 = {
  type: 'LeafType1'
  foo: string
}

export type LeafType2 = {
  type: 'LeafType2'
  bar: string
}

export type LeafType3 = {
  type: 'LeafType3'
  foobar: string
}

export type MidLevelUnionType = LeafType2 | LeafType3

export type TopLevelUnionType = LeafType1 | MidLevelUnionType