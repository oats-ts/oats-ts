import { OpenAPIObject } from '@oats-ts/openapi-model'

export type GeneratorModel = {
  schemaPath: string
  sourcePath: string
  schema: () => OpenAPIObject
}
