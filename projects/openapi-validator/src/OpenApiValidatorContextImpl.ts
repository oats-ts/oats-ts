import { GeneratorContextImpl } from '@oats-ts/model-common'
import { OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIObject } from '@oats-ts/openapi-model'
import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OpenAPIValidatorContext } from './typings'

export class OpenAPIValidatorContextImpl
  extends GeneratorContextImpl<OpenAPIObject, GeneratorConfig, OpenAPIGeneratorTarget>
  implements OpenAPIValidatorContext
{
  readonly validated: Set<any> = new Set()

  public constructor(data: OpenAPIReadOutput) {
    super(
      undefined!,
      data,
      { noEmit: true, nameProvider: (input, name) => name ?? '', pathProvider: (input, name) => '' },
      [],
    )
  }
  public override dependenciesOf = () => {
    throw new Error(`Cannot use dependenciesOf in a validator context`)
  }
  public override referenceOf = () => {
    throw new Error(`Cannot use referenceOf in a validator context`)
  }
}
