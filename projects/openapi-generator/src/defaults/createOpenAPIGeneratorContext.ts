import { OpenAPIReadOutput } from '../../../openapi-reader/lib'
import { OpenAPIAccessorImpl } from '../common/OpenAPIAccessor'
import { OpenAPIGenerator, OpenAPIGeneratorConfig, OpenAPIGeneratorContext } from '../typings'

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
