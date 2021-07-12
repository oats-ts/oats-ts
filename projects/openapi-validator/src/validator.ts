import { ContentValidator } from '@oats-ts/generator'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Issue } from '@oats-ts/validators'
import { flatMap } from 'lodash'
import { OpenAPIValidatorConfig } from './typings'
import { createOpenAPIValidatorConfig } from './createOpenAPIValidatorConfig'
import { createOpenAPIValidatorContext } from './createOpenAPIValidatorContext'

export function validator(configuration: Partial<OpenAPIValidatorConfig> = {}): ContentValidator<OpenAPIReadOutput> {
  return async function _validator(data: OpenAPIReadOutput): Promise<Issue[]> {
    const config = createOpenAPIValidatorConfig(configuration)
    const context = createOpenAPIValidatorContext(data)
    const { openApiObject } = config
    return flatMap(context.documents, (document) => openApiObject(document, context, config))
  }
}
