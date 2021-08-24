import { CodeGenerator, GeneratorConfig } from '@oats-ts/generator'
import { dependenciesOf } from './dependenciesOf'
import { dereference } from './dereference'
import { nameOf } from './nameOf'
import { pathOf } from './pathOf'
import { referenceOf } from './referenceOf'
import { GeneratorContext, ReadOutput } from './types'
import { uriOf } from './uriOf'

export function createGeneratorContext<R, T extends string, C extends GeneratorConfig>(
  data: ReadOutput<R>,
  config: C,
  generators: CodeGenerator<any, any>[],
): GeneratorContext<R, T> {
  return {
    document: data.document,
    documents: Array.from(data.documents.values()),
    dereference: dereference(data),
    dependenciesOf: dependenciesOf(generators),
    nameOf: nameOf(data, config),
    pathOf: pathOf(data, config),
    referenceOf: referenceOf(generators),
    uriOf: uriOf(data),
  }
}
