import { Result } from '@oats-ts/generator'
import { defaultTypeScriptWriterConfig } from './defaults/defaultTypeScriptWriterConfig'
import { mergeTypeScriptModules } from './mergeTypeScriptModules'
import { purgeDirectories } from './purgeDirectories'
import { TypeScriptModule, TypeScriptWriterConfig } from './typings'

export const writer =
  (config: TypeScriptWriterConfig) =>
  async (modules: TypeScriptModule[]): Promise<Result<TypeScriptModule[]>> => {
    const { stringify, write, comments } = defaultTypeScriptWriterConfig(config)
    const mergedModules = mergeTypeScriptModules(modules)
    const stringifiedData = await Promise.all(
      mergedModules.map((unit) =>
        stringify(unit, comments).then((result): [TypeScriptModule, string] => [unit, result]),
      ),
    )
    await Promise.all(stringifiedData.map(([{ path }, content]) => write(path, content)))
    // TODO probably need better error checks here...
    return {
      isOk: true,
      issues: [],
      data: mergedModules,
    }
  }
