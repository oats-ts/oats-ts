import { UnionTypeGuardGeneratorConfig } from './typings'

export function isUnionTypeGuardGeneratorConfig(input: any): input is UnionTypeGuardGeneratorConfig {
  return typeof input === 'object' && input !== null && input.discriminatorBased === true
}
