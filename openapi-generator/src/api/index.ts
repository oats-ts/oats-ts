import { BabelGeneratorOutput, BabelModule } from '@oats-ts/babel-writer'
import { Try } from '@oats-ts/generator'
import { sortBy } from 'lodash'
import { Severity } from '../../../validators/lib'
import { getEnhancedOperations } from '../operations/getEnhancedOperations'
import { OpenAPIGeneratorContext } from '../typings'
import { generateApiClass } from './apiClass/generateApiClass'
import { generateApiStub } from './apiStub/generateApiStub'
import { generateApiType } from './apiType/generateApiType'
import { ApiGeneratorConfig } from './typings'

export const api =
  (config: ApiGeneratorConfig) =>
  async (context: OpenAPIGeneratorContext): Promise<Try<BabelGeneratorOutput>> => {
    const document = context.accessor.document()
    const operations = sortBy(getEnhancedOperations(document, context), ({ operation }) =>
      context.accessor.name(operation, 'operation'),
    )
    const modules = [
      ...(config.type ? [generateApiType(document, operations, context)] : []),
      ...(config.class ? [generateApiClass(document, operations, context, config.type)] : []),
      ...(config.stub ? [generateApiStub(document, operations, context, config.type)] : []),
    ]
    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return { modules }
  }
