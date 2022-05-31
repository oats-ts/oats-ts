import { Try } from '@oats-ts/try'
import { Logger } from '@oats-ts/log'

export type ContentReader<R> = (logger: Logger) => Promise<Try<R>>
export type ContentValidator<R> = (data: R, logger: Logger) => Promise<Try<R>>
export type ContentGenerator<R, G> = (data: R, logger: Logger) => Promise<Try<G>>
export type ContentWriter<G> = (data: G, logger: Logger) => Promise<Try<G>>

export type GeneratorInput<R, G> = {
  logger?: Logger
  validator?: ContentValidator<R>
  reader: ContentReader<R>
  generator: ContentGenerator<R, G>
  writer: ContentWriter<G>
}
