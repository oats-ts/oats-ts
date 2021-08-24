import { NamedEnum } from './NamedEnum'
import { NamedRecord } from './NamedRecord'

export type NamedComplexObject = {
  enumProperty?: 'Racoon' | 'Dog' | 'Cat'
  enumReferenceProperty?: NamedEnum
  'non-identifier * property}'?: string
  recordProperty?: Record<string, boolean>
  referenceArrayProperty?: NamedRecord[]
  referenceProperty?: NamedRecord
  referenceRecordProperty?: Record<string, NamedRecord>
  stringArrayProperty?: string[]
}
