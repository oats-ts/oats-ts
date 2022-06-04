export type EventMap = Record<string, any>
export type EventKey<T extends EventMap> = string & keyof T
export type EventReceiver<T> = (params: T) => void

export interface EventEmitter<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): unknown
  addListener<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): unknown
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): this
  removeListener<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): unknown
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): unknown
  //   once<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): unknown
  //   removeAllListeners<K extends EventKey<T>>(eventName?: K): unknown
  //   listenerCount<K extends EventKey<T>>(eventName: K): number
  //   eventNames<K extends EventKey<T>>(): Array<K>
}

import { Try } from '@oats-ts/try'

export type ReadStepStarted = {
  type: 'read-step-started'
}

export type ReadFileStarted = {
  type: 'read-file-started'
  path: string
}

export type ReadFileCompleted<P> = {
  type: 'read-file-completed'
  path: string
  data: Try<P>
}

export type ReadStepCompleted<R> = {
  type: 'read-step-completed'
  data: Try<R>
}

export type ReadEvent<P, R> = ReadStepStarted | ReadFileStarted | ReadFileCompleted<P> | ReadStepCompleted<R>

export type ValidatorStepStarted = {
  type: 'validator-step-started'
}

export type ValidateFileStarted<P> = {
  type: 'validate-file-started'
  path: string
  data: P
}

export type ValidateFileCompleted<P> = {
  type: 'validate-file-completed'
  path: string
  data: Try<P>
}

export type ValidatorStepCompleted = {
  type: 'validate-step-completed'
}

export type ValidatorEvent<P> =
  | ValidatorStepStarted
  | ValidateFileStarted<P>
  | ValidateFileCompleted<P>
  | ValidatorStepCompleted

export type GeneratorStepStarted = {
  type: 'generator-step-started'
}

export type GeneratorStarted = {
  type: 'generator-started'
  id: string
  name: string
}

export type GeneratorProgress<G> = {
  type: 'generator-progress'
  id: string
  name: string
  input: any
  data: Try<G>
}

export type GeneratorCompleted<G> = {
  type: 'generator-completed'
  id: string
  name: string
  data: Try<G[]>
}

export type GeneratorStepCompleted<G> = {
  type: 'generator-step-completed'
  data: Try<G[]>
}

export type GeneratorEvent<G> =
  | GeneratorStepStarted
  | GeneratorStarted
  | GeneratorProgress<G>
  | GeneratorCompleted<G>
  | GeneratorStepCompleted<G>

export type WriterStepStarted = {
  type: 'writer-step-started'
}

export type WriteFileStarted<G> = {
  type: 'write-file-started'
  data: G
}

export type WriteFileCompleted<G> = {
  type: 'write-file-completed'
  data: Try<G>
}

export type WriterStepCompleted = {
  type: 'writer-step-completed'
}

export type WriterEvent<G> = WriterStepStarted | WriteFileStarted<G> | WriteFileCompleted<G> | WriterStepCompleted

export type ReadEventMap<P, R> = {
  'read-step-started': ReadStepStarted
  'read-file-started': ReadFileStarted
  'read-file-completed': ReadFileCompleted<P>
  'read-step-completed': ReadStepCompleted<R>
}

export type ValidatorEventMap<P> = {
  'validator-step-started': ValidatorStepStarted
  'validate-file-started': ValidateFileStarted<P>
  'validate-file-completed': ValidateFileCompleted<P>
  'validator-step-completed': ValidatorStepCompleted
}

export type GeneratorEventMap<G> = {
  'generator-step-started': GeneratorStepStarted
  'generator-started': GeneratorStarted
  'generator-progress': GeneratorProgress<G>
  'generator-completed': GeneratorCompleted<G>
  'generator-step-completed': GeneratorStepCompleted<G>
}

export type WriterEventMap<G> = {
  'generator-step-started': WriterStepStarted
  'generator-started': WriteFileStarted<G>
  'generator-progress': WriteFileCompleted<G>
  'generator-completed': WriterStepCompleted
}

export type OatsEventMap<P, R, G> = ReadEventMap<P, R> & ValidatorEventMap<P> & GeneratorEventMap<G> & WriterEventMap<G>

export type ReaderEventEmitter<P, R> = EventEmitter<ReadEventMap<P, R>>
export type ValidatorEventEmitter<P> = EventEmitter<ValidatorEventMap<P>>
export type GeneratorEventEmitter<G> = EventEmitter<GeneratorEventMap<G>>
export type WriterEventEmitter<G> = EventEmitter<WriterEventMap<G>>
export type OatsEventEmitter<P, R, G> = EventEmitter<OatsEventMap<P, R, G>>
