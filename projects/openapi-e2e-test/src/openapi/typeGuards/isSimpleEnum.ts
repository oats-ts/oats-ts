import { SimpleEnum } from '../types/SimpleEnum'

export function isSimpleEnum(input: any): input is SimpleEnum {
  return input === 'A' || input === 'B' || input === 'C'
}
