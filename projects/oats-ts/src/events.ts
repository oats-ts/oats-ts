import type { Try } from '@oats-ts/try'
import type { Issue } from '@oats-ts/validators'
import type { StructuredGeneratorResult } from './typings'

export type EventMap = Record<string, any>
export type EventKey<T extends EventMap> = string & keyof T
export type EventReceiver<T> = (params: T) => void

export interface EventEmitter<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): unknown
  addListener<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): unknown
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): this
  removeListener<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): unknown
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): unknown
  removeAllListeners<K extends EventKey<T>>(eventName?: K): unknown
}

export type ReadStepStarted = {
  type: 'read-step-started'
  name: string
}

export type ReadFileStarted = {
  type: 'read-file-started'
  path: string
}

export type ReadFileProgress = {
  type: 'read-file-progress'
  path: string
  status: string
  issues: Issue[]
}

export type ReadFileCompleted<P> = {
  type: 'read-file-completed'
  path: string
  data: Try<P>
  issues: Issue[]
}

export type ReadStepCompleted<R> = {
  type: 'read-step-completed'
  data: Try<R>
  name: string
  issues: Issue[]
}

export type ReadEvent<P, R> =
  | ReadStepStarted
  | ReadFileStarted
  | ReadFileProgress
  | ReadFileCompleted<P>
  | ReadStepCompleted<R>

export type ValidatorStepStarted = {
  name: string
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
  issues: Issue[]
}

export type ValidatorStepCompleted = {
  type: 'validate-step-completed'
  name: string
  issues: Issue[]
}

export type ValidatorEvent<P> =
  | ValidatorStepStarted
  | ValidateFileStarted<P>
  | ValidateFileCompleted<P>
  | ValidatorStepCompleted

export type GeneratorStepStarted = {
  name: string
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
  issues: Issue[]
}

export type GeneratorCompleted<G> = {
  type: 'generator-completed'
  id: string
  name: string
  data: Try<G[]>
  structure: StructuredGeneratorResult<G>
  dependencies: string[]
  issues: Issue[]
}

export type GeneratorStepCompleted<G> = {
  type: 'generator-step-completed'
  data: Try<G[]>
  structure: StructuredGeneratorResult<G>
  name: string
  dependencies: string[]
  issues: Issue[]
}

export type GeneratorEvent<G> =
  | GeneratorStepStarted
  | GeneratorStarted
  | GeneratorProgress<G>
  | GeneratorCompleted<G>
  | GeneratorStepCompleted<G>

export type WriterStepStarted = {
  name: string
  type: 'writer-step-started'
}

export type WriteFileStarted<G> = {
  type: 'write-file-started'
  data: G
}

export type WriteFileCompleted<G> = {
  type: 'write-file-completed'
  data: Try<G>
  issues: Issue[]
}

export type WriterStepCompleted<G> = {
  type: 'writer-step-completed'
  data: Try<G[]>
  name: string
  issues: Issue[]
}

export type WriterEvent<G> = WriterStepStarted | WriteFileStarted<G> | WriteFileCompleted<G> | WriterStepCompleted<G>

export type ReadEventMap<P, R> = {
  'read-step-started': ReadStepStarted
  'read-file-started': ReadFileStarted
  'read-file-progress': ReadFileProgress
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
  'writer-step-started': WriterStepStarted
  'write-file-started': WriteFileStarted<G>
  'write-file-completed': WriteFileCompleted<G>
  'writer-step-completed': WriterStepCompleted<G>
}

export type OatsEventMap<P, R, G> = ReadEventMap<P, R> & ValidatorEventMap<P> & GeneratorEventMap<G> & WriterEventMap<G>

export type ReaderEventEmitter<P, R> = EventEmitter<ReadEventMap<P, R>>
export type ValidatorEventEmitter<P> = EventEmitter<ValidatorEventMap<P>>
export type GeneratorEventEmitter<G> = EventEmitter<GeneratorEventMap<G>>
export type WriterEventEmitter<G> = EventEmitter<WriterEventMap<G>>
export type OatsEventEmitter<P = any, R = any, G = any> = EventEmitter<OatsEventMap<P, R, G>>
