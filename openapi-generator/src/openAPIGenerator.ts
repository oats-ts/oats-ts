import type { TypeScriptGeneratorOutput, TypeScriptModule } from '@oats-ts/typescript-writer'
import type { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { Try, isFailure } from '@oats-ts/generator'
import { Issue, Severity } from '@oats-ts/validators'
import { OpenAPIGeneratorContext, OpenAPIGeneratorConfig, OpenAPIChildGenerator } from './typings'
import { DefaultOpenAPIAccessor } from './common/DefaultOpenAPIAccessor'
import { defaultOpenAPIGeneratorConfig } from './defaults/defaultOpenAPIGeneratorConfig'
import { tsMergeModules } from './common/tsMergeModules'

export const openAPIGenerator =
  (config: OpenAPIGeneratorConfig) =>
  (...generators: OpenAPIChildGenerator[]) =>
  async (data: OpenAPIReadOutput): Promise<Try<TypeScriptGeneratorOutput>> => {
    const allModules: TypeScriptModule[] = []
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
      allModules.push(...results.modules)
    }
    if (allIssues.some((issue) => issue.severity === Severity.ERROR)) {
      return {
        issues: allIssues,
      }
    }
    return {
      modules: tsMergeModules(allModules),
    }
  }
