import { SimpleLoggerPlugin } from './SimpleLoggerPlugin'
import { VerboseLoggerPlugin } from './VerboseLoggerPlugin'

export { SimpleLoggerPlugin } from './SimpleLoggerPlugin'
export { VerboseLoggerPlugin } from './VerboseLoggerPlugin'

export const loggers = {
  simple: () => new SimpleLoggerPlugin(),
  verbose: () => new VerboseLoggerPlugin(),
}
