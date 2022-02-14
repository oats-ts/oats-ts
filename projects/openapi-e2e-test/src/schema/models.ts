import { OpenAPIObject } from '@oats-ts/openapi-model'
import { generateBodiesOpenApiObject } from './bodies/generateBodiesOpenApiObject'
import { GeneratorModel } from './GeneratorModel'
import { generateHttpMethodsOpenApiObject } from './methods/generateHttpMethodsOpenApiObject'
import { generateParametersOpenApiObject } from './parameters/generateParametersOpenApiObject'
import bookStore from '../../schemas/book-store.json'
import kitchenSink from '../../schemas/kitchen-sink.json'

export const models: GeneratorModel[] = [
  {
    schemaPath: 'schemas/parameters.json',
    sourcePath: 'src/generated/Parameters.ts',
    alternativePath: 'src/generated/parameters',
    schema: generateParametersOpenApiObject,
  },
  {
    schemaPath: 'schemas/http-methods.json',
    sourcePath: 'src/generated/HttpMethods.ts',
    alternativePath: 'src/generated/httpMethods',
    schema: generateHttpMethodsOpenApiObject,
  },
  {
    schemaPath: 'schemas/bodies.json',
    sourcePath: 'src/generated/Bodies.ts',
    alternativePath: 'src/generated/bodies',
    schema: generateBodiesOpenApiObject,
  },
  {
    schemaPath: 'schemas/book-store.json',
    sourcePath: 'src/generated/BookStore.ts',
    alternativePath: 'src/generated/bookStore',
    schema: () => bookStore as OpenAPIObject,
  },
  {
    schemaPath: 'schemas/kitchen-sink.json',
    sourcePath: 'src/generated/KitchenSink.ts',
    alternativePath: 'src/generated/kitchenSink',
    schema: () => kitchenSink as OpenAPIObject,
  },
]
