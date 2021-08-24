import { NamedEnum } from '../types/NamedEnum'

export function isNamedEnum(input: any): input is NamedEnum {
  return input === 'A' || input === 'B' || input === 'C'
}
