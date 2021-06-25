import { OpenAPIReadOutput } from '../../../openapi-reader/lib'
import { OpenAPIAccessorImpl } from '../common/OpenAPIAccessor'
import { OpenAPIGeneratorConfig, OpenAPIGeneratorContext } from '../typings'

export function createOpenAPIGeneratorContext<T extends OpenAPIGeneratorConfig>(
  data: OpenAPIReadOutput,
  config: T,
): OpenAPIGeneratorContext {
  return {
    accessor: new OpenAPIAccessorImpl(config, data),
    issues: [],
  }
}
