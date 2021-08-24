import { NamedRecord } from '../types/NamedRecord'

export function isNamedRecord(input: any): input is NamedRecord {
  return (
    input !== null && typeof input === 'object' && Object.keys(input).every((key) => typeof input[key] === 'number')
  )
}
