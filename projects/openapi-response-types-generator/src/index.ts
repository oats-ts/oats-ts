import { ResponseTypesGenerator } from './ResponseTypesGenerator'

export { ResponseTypesGenerator } from './ResponseTypesGenerator'

export function responseTypes(): ResponseTypesGenerator {
  return new ResponseTypesGenerator()
}
