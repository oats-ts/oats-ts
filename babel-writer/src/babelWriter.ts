import type { Try } from '@oats-ts/generator'
import { defaultOpenAPIWriteConfig } from './defaults/defaultOpenAPIWriteConfig'
import type { BabelGeneratorOutput, BabelModule, BabelWriterConfig } from './typings'

export const babelWriter =
  (config: BabelWriterConfig) =>
  async (data: BabelGeneratorOutput): Promise<Try<null>> => {
    const { stringify, write } = defaultOpenAPIWriteConfig(config)
    const { modules } = data
    const stringifiedData = await Promise.all(
      modules.map((unit) => stringify(unit).then((result): [BabelModule, string] => [unit, result])),
    )
    await Promise.all(stringifiedData.map(([{ path }, content]) => write(path, content)))
    return null
  }
