import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OpenAPIAccessorImpl } from './OpenAPIAccessorImpl'
import { OpenAPIGenerator, OpenAPIGeneratorContext, OpenAPIGeneratorConfig } from './typings'

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
