import type { BabelModule, BabelGeneratorOutput } from '@oats-ts/babel-writer'
import type { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Try, isFailure } from '@oats-ts/generator'
import { Issue, Severity } from '@oats-ts/validators'
import { mergeModules } from './common/mergeModules'
import { OpenAPIGeneratorContext, OpenAPIChildGenerator, OpenAPIGeneratorConfig } from './typings'
import { DefaultOpenAPIAccessor } from './common/DefaultOpenAPIAccessor'
import { defaultOpenAPIGeneratorConfig } from './defaults/defaultOpenAPIGeneratorConfig'

export const openAPIGenerator =
  (config: OpenAPIGeneratorConfig) =>
  (...generators: OpenAPIChildGenerator[]) =>
  async (data: OpenAPIReadOutput): Promise<Try<BabelGeneratorOutput>> => {
    const allUnits: BabelModule[] = []
    const allIssues: Issue[] = []

    const fullConfig = defaultOpenAPIGeneratorConfig(config)

    const context: OpenAPIGeneratorContext = {
      accessor: new DefaultOpenAPIAccessor(fullConfig, data),
      issues: [],
    }

    for (const generator of generators) {
      const results = await generator(context)
      if (isFailure(results)) {
        allIssues.push(...results.issues)
        break
      }
      allUnits.push(...results.modules)
    }
    if (allIssues.some((issue) => issue.severity === Severity.ERROR)) {
      return {
        issues: allIssues,
      }
    }
    return {
      modules: mergeModules(allUnits),
    }
  }
