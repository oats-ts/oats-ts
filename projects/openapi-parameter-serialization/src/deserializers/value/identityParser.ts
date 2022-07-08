import { success } from '@oats-ts/try'
import { ValueDeserializer } from '../../types'

export const identityParser: ValueDeserializer<any, any> = <T>(value: T) => success(value)
