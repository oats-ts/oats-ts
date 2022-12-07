import { GeneratorConfig } from '@oats-ts/oats-ts'
import { OpenAPIGeneratorContextImpl, OpenAPIReadOutput } from '@oats-ts/openapi-common'
import { OpenAPIValidatorContext } from './typings'

export class OpenAPIValidatorContextImpl
  extends OpenAPIGeneratorContextImpl<GeneratorConfig>
  implements OpenAPIValidatorContext
{
  readonly validated: Set<any> = new Set()

  public constructor(data: OpenAPIReadOutput) {
    super(
      undefined!,
      data,
      { noEmit: true, nameProvider: (input, name) => name ?? '', pathProvider: (input, name) => '' },
      [],
      {},
    )
  }
  public override dependenciesOf = () => {
    throw new Error(`Cannot use dependenciesOf in a validator context`)
  }
  public override referenceOf = () => {
    throw new Error(`Cannot use referenceOf in a validator context`)
  }
}
