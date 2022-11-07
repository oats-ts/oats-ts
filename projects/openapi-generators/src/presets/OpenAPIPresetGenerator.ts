import { GeneratorConfig } from '@oats-ts/oats-ts'
import { clone, cloneDeep, merge } from 'lodash'
import { OpenAPIGroupGenerator } from '../group/OpenAPIGroupGenerator'
import { createOpenAPIGenerators } from './createOpenAPIGenerators'
import { OpenAPIPresetConfig } from './types'

export class OpenAPIPresetGenerator extends OpenAPIGroupGenerator {
  public constructor(
    name: string,
    private readonly preset: Readonly<OpenAPIPresetConfig>,
    globalConfig: Partial<GeneratorConfig> = {},
  ) {
    super(name, createOpenAPIGenerators(preset), globalConfig)
  }

  public override(preset: OpenAPIPresetConfig): OpenAPIPresetGenerator {
    return new OpenAPIPresetGenerator(
      this.customName(),
      merge(cloneDeep(this.preset), cloneDeep(preset)),
      cloneDeep(this.globalConfig),
    )
  }

  public configure(config: GeneratorConfig): OpenAPIPresetGenerator {
    return new OpenAPIPresetGenerator(
      this.customName(),
      cloneDeep(this.preset),
      merge(cloneDeep(this.globalConfig), clone(config)),
    )
  }

  private customName(): string {
    const name = this.name()
    return name.endsWith('(custom)') ? name : `${name} (custom)`
  }
}
