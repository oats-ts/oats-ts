import { AdditionalServiceType } from '../types/AdditionalServiceType'

export function isAdditionalServiceType(input: any): input is AdditionalServiceType {
  return input === 'CHECKED_BAGS' || input === 'MEALS' || input === 'SEATS' || input === 'OTHER_SERVICES'
}
