import { Try } from '@oats-ts/try'
import { Logger } from '@oats-ts/log'
import { GeneratorEventEmitter, ReaderEventEmitter, ValidatorEventEmitter, WriterEventEmitter } from '@oats-ts/events'

export type ContentReader<P, R> = (emitter: ReaderEventEmitter<P, R>) => Promise<Try<R>>
export type ContentValidator<P, R> = (data: R, emitter: ValidatorEventEmitter<P>) => Promise<Try<R>>
export type ContentGenerator<R, G> = (data: R, emitter: GeneratorEventEmitter<G>) => Promise<Try<G[]>>
export type ContentWriter<G> = (data: G[], emitter: WriterEventEmitter<G>) => Promise<Try<G[]>>

export type GeneratorInput<P, R, G> = {
  logger?: Logger
  validator?: ContentValidator<P, R>
  reader: ContentReader<P, R>
  generator: ContentGenerator<R, G>
  writer: ContentWriter<G>
}
