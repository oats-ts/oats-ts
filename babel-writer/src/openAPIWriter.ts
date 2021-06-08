import { Try } from '@oats-ts/generator'
import { OpenAPIGeneratorOutput } from '../types/OpenAPIGeneratorOutput'
import { OpenAPIGlobalConfig } from '../types/OpenAPIGlobalConfig'
import { OpenAPIWriteConfig } from '../types/OpenAPIWriteConfig'
import { TypeScriptUnit } from '../types/TypeScriptUnit'
import { defaultOpenAPIWriteConfig } from './defaults/defaultOpenAPIWriteConfig'

export const openAPIWriter =
  (config: Partial<OpenAPIWriteConfig> = {}) =>
  async (data: OpenAPIGeneratorOutput): Promise<Try<null>> => {
    const { stringify, write } = defaultOpenAPIWriteConfig(config)
    const { units } = data
    const stringifiedData = await Promise.all(
      units.map((unit) => stringify(unit).then((result): [TypeScriptUnit, string] => [unit, result])),
    )
    await Promise.all(stringifiedData.map(([{ path }, content]) => write(path, content)))
    return null
  }
