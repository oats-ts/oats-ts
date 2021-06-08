import { defaultOpenAPIGlobalConfig } from '../../defaults/defaultOpenAPIGlobalConfig'
import { Issue } from '../../validation/typings'
import { OpenAPIGenerator, OpenAPIMainGenerator } from '../types/OpenAPIGenator'
import { OpenAPIGeneratorOutput } from '../types/OpenAPIGeneratorOutput'
import { OpenAPIGlobalConfig } from '../types/OpenAPIGlobalConfig'
import { OpenAPIReadOutput } from '../types/OpenAPIReadOutput'
import { TypeScriptUnit } from '../types/TypeScriptUnit'
import { createOpenAPIUtils } from './createOpenAPIUtils'
import { mergeUnits } from './mergeUnits'
import { GeneratorContext } from './typings'

export const openAPIGenerator =
  (...generators: OpenAPIGenerator[]): OpenAPIMainGenerator =>
  (globalConfig: OpenAPIGlobalConfig) =>
  async (data: OpenAPIReadOutput): Promise<OpenAPIGeneratorOutput> => {
    const { uri } = defaultOpenAPIGlobalConfig(globalConfig)
    const allUnits: TypeScriptUnit[] = []
    const allIssues: Issue[] = []
    const context: GeneratorContext = {
      ...data,
      uri: uri,
      issues: [],
      utils: createOpenAPIUtils(uri, data.documents, data.uris),
    }
    for (const generator of generators) {
      const { issues, units } = await generator(context)
      allUnits.push(...units)
      allIssues.push(...issues)
    }
    return {
      issues: allIssues,
      units: mergeUnits(allUnits),
    }
  }
