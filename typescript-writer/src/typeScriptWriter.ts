import type { Try } from '@oats-ts/generator'
import { defaultTypeScriptWriterConfig } from './defaults/defaultTypeScriptWriterConfig'
import type { TypeScriptGeneratorOutput, TypeScriptModule, TypeScriptWriterConfig } from './typings'

export const typeScriptWriter =
  (config: TypeScriptWriterConfig) =>
  async (data: TypeScriptGeneratorOutput): Promise<Try<null>> => {
    const { stringify, write } = defaultTypeScriptWriterConfig(config)
    const { modules } = data
    const stringifiedData = await Promise.all(
      modules.map((unit) => stringify(unit).then((result): [TypeScriptModule, string] => [unit, result])),
    )
    await Promise.all(stringifiedData.map(([{ path }, content]) => write(path, content)))
    return null
  }
