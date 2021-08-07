import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { GeneratorConfig } from '@oats-ts/generator'
import { OpenAPIGenerator, OpenAPIGeneratorContext } from './typings'
import { dependenciesOf } from './dependenciesOf'
import { dereference } from './dereference'
import { nameOf } from './nameOf'
import { pathOf } from './pathOf'
import { referenceOf } from './referenceOf'
import { uriOf } from './uriOf'

export function createOpenAPIGeneratorContext<T extends GeneratorConfig>(
  data: OpenAPIReadOutput,
  config: T,
  generators: OpenAPIGenerator[],
): OpenAPIGeneratorContext {
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
