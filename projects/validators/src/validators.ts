import { any } from './validators/any'
import { combine } from './validators/combine'
import { record } from './validators/record'
import { restrictKeys } from './validators/restrictKeys'
import { enumeration } from './validators/enumeration'
import { shape } from './validators/shape'
import { items } from './validators/items'
import { tuple } from './validators/tuple'
import { array, boolean, nil, number, object, string, integer } from './validators/type'
import { optional } from './validators/optional'
import { union } from './validators/union'
import { lazy } from './validators/lazy'
import { literal } from './validators/literal'
import { minLength } from './validators/minLength'

export const validators = {
  any,
  combine,
  record,
  restrictKeys,
  enumeration,
  shape,
  items,
  tuple,
  array,
  boolean,
  nil,
  number,
  object,
  string,
  optional,
  union,
  lazy,
  literal,
  minLength,
  integer,
} as const
