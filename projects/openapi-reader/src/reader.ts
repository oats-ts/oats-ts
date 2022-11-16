import { ContentReader } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { OpenAPIReadConfig, OpenAPIReadOutput } from './typings'
import { OpenAPIReader } from './OpenAPIReader'

export function reader(config: OpenAPIReadConfig): ContentReader<OpenAPIObject, OpenAPIReadOutput> {
  return new OpenAPIReader(config)
}
