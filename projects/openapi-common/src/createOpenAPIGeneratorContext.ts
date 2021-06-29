import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OpenAPIGeneratorConfig } from '@oats-ts/openapi'
import { OpenAPIAccessorImpl } from './OpenAPIAccessorImpl'
import { OpenAPIGenerator, OpenAPIGeneratorContext } from './typings'

export function createOpenAPIGeneratorContext<T extends OpenAPIGeneratorConfig>(
  data: OpenAPIReadOutput,
  config: T,
  generators: OpenAPIGenerator[],
): OpenAPIGeneratorContext {
  return {
    accessor: new OpenAPIAccessorImpl(config, data, generators),
    issues: [],
  }
}
