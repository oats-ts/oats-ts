import { success } from '@oats-ts/try'
import { ValueParser } from '../types'

export const identityParser: ValueParser<any, any> = <T>(value: T) => success(value)
