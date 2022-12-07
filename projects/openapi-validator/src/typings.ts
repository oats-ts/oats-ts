import { OpenAPIGeneratorContext } from '@oats-ts/openapi-common'

export type OpenAPIValidatorContext = OpenAPIGeneratorContext & {
  readonly validated: Set<any>
}
