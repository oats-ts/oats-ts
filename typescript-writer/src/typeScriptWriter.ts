import type { Try } from '@oats-ts/generator'
import { defaultTypeScriptWriterConfig } from './defaults/defaultTypeScriptWriterConfig'
import { mergeTypeScriptModules } from './mergeTypeScriptModules'
import type { TypeScriptModule, TypeScriptWriterConfig } from './typings'

export const typeScriptWriter =
  (config: TypeScriptWriterConfig) =>
  async (modules: TypeScriptModule[]): Promise<Try<null>> => {
    const { stringify, write } = defaultTypeScriptWriterConfig(config)
    const mergedModules = mergeTypeScriptModules(modules)
    const stringifiedData = await Promise.all(
      mergedModules.map((unit) => stringify(unit).then((result): [TypeScriptModule, string] => [unit, result])),
    )
    await Promise.all(stringifiedData.map(([{ path }, content]) => write(path, content)))
    return null
  }
