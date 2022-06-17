import { Try } from '@oats-ts/try'
import { ValidatorConfig } from '@oats-ts/validators'

/** Types that can be individual parameter values */
export type Primitive = string | number | boolean | undefined
export type PrimitiveArray = ReadonlyArray<Primitive> | undefined
export type PrimitiveRecord = Record<string, Primitive> | undefined

/** Union type for above */
export type ParameterValue = Primitive | PrimitiveArray | PrimitiveRecord

/** Object, collection of named parameter values */
export type ParameterObject = Record<string, ParameterValue>

/** Query related types */
export type QueryOptions = {
  explode?: boolean
  required?: boolean
}

export type QuerySerializer<T extends ParameterValue | undefined> = (
  value: T,
  name: string,
  path: string,
  config: ValidatorConfig,
) => Try<string[]>
export type QuerySerializers<T extends ParameterObject> = { [P in keyof T]: QuerySerializer<T[P]> }

/** Path related types */
export type PathOptions = {
  explode?: boolean
}

export type PathSerializer<T extends ParameterValue | undefined> = (
  value: T,
  name: string,
  path: string,
  config: ValidatorConfig,
) => Try<string>
export type PathSerializers<T extends ParameterObject> = { [P in keyof T]: PathSerializer<T[P]> }

/** Header related types */
export type HeaderOptions = {
  explode?: boolean
  required?: boolean
}

export type HeaderSerializer<T extends ParameterValue | undefined> = (
  value: T,
  name: string,
  path: string,
  config: ValidatorConfig,
) => Try<string | undefined>
export type HeaderSerializers<T extends ParameterObject> = { [P in keyof T]: HeaderSerializer<T[P]> }
