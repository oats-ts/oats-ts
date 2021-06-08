import { Options, format } from 'prettier'
import { defaultStringify } from './defaults/defaultStringify'
import { BabelModule } from './typings'

export const prettierStringify =
  (options: Options = {}) =>
  async (data: BabelModule): Promise<string> => {
    return format(await defaultStringify(data), options)
  }
