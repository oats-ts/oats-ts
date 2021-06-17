import { BabelGeneratorOutput, BabelModule } from '@oats-ts/babel-writer'
import { Try } from '@oats-ts/generator'
import { Severity } from '../../../validators/lib'
import { getEnhancedOperations } from '../operations/getEnhancedOperations'
import { OpenAPIGeneratorContext } from '../typings'
import { generateApiClass } from './apiClass/generateApiClass'
import { generateApiType } from './apiType/generateApiType'
import { ApiGeneratorConfig } from './typings'

export const api =
  (config: ApiGeneratorConfig) =>
  async (context: OpenAPIGeneratorContext): Promise<Try<BabelGeneratorOutput>> => {
    const document = context.accessor.document()
    const operations = getEnhancedOperations(context.accessor.document(), context)
    const modules = [
      generateApiType(document, operations, context),
      ...(config.implementation ? [generateApiClass(document, operations, context)] : []),
    ]
    if (context.issues.some((issue) => issue.severity === Severity.ERROR)) {
      return { issues: context.issues }
    }
    return { modules }
  }
