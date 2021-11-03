import { NumberArray } from '../types/NumberArray'

export function isNumberArray(input: any): input is NumberArray {
  return Array.isArray(input) && input.every((item: any) => typeof item === 'number')
}
