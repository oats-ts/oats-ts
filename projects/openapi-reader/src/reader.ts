import { ContentReader } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { OpenAPIReadConfig } from './typings'
import { OpenAPIReader } from './OpenAPIReader'
import { OpenAPIReadOutput } from '@oats-ts/openapi-common'

export function reader(config: OpenAPIReadConfig): ContentReader<OpenAPIObject, OpenAPIReadOutput> {
  return new OpenAPIReader(config)
}
