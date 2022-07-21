import { typed } from '../typed'
import { Issue, Validator } from '../typings'

const Type = 'any' as const

export const any = (): Validator<any> => typed((): Issue[] => [], Type)
