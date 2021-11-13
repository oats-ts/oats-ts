import { GeneratorModel } from './GeneratorModel'
import { generateHttpMethodsOpenApiObject } from './methods/generateHttpMethodsOpenApiObject'
import { generateParametersOpenApiObject } from './parameters/generateParametersOpenApiObject'

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
]
