import { OpenAPIObject } from '@oats-ts/openapi-model'
import { generateBodiesOpenApiObject } from './bodies/generateBodiesOpenApiObject'
import { GeneratorModel } from './GeneratorModel'
import { generateHttpMethodsOpenApiObject } from './methods/generateHttpMethodsOpenApiObject'
import { generateParametersOpenApiObject } from './parameters/generateParametersOpenApiObject'
import bookStore from '../../schemas/book-store.json'

export const models: GeneratorModel[] = [
  {
    schemaPath: 'schemas/parameters.json',
    sourcePath: 'src/generated/Parameters.ts',
    schema: generateParametersOpenApiObject,
  },
  {
    schemaPath: 'schemas/http-methods.json',
    sourcePath: 'src/generated/HttpMethods.ts',
    schema: generateHttpMethodsOpenApiObject,
  },
  {
    schemaPath: 'schemas/bodies.json',
    sourcePath: 'src/generated/Bodies.ts',
    schema: generateBodiesOpenApiObject,
  },
  {
    schemaPath: 'schemas/book-store.json',
    sourcePath: 'src/generated/BookStore.ts',
    schema: () => bookStore as OpenAPIObject,
  },
]
