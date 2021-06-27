import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import {
  OpenAPIAccessorImpl,
  OpenAPIGenerator,
  OpenAPIGeneratorContext,
  OpenAPIGeneratorConfig,
} from '@oats-ts/openapi-common'

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
