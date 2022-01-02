import { generators } from './generators'
import { ValidatorsGeneratorConfig } from '@oats-ts/openapi-validators-generator'
import { OpenAPIGenerator } from '@oats-ts/openapi-common'
import { TypeGuardGeneratorConfig } from '@oats-ts/openapi-type-guards-generator'

type PresetConfig = {
  documentation: boolean
  validate: boolean
  validators: ValidatorsGeneratorConfig
  typeGuards: TypeGuardGeneratorConfig
}

const DefaultPresetConfig: PresetConfig = {
  documentation: true,
  validate: true,
  typeGuards: {
    arrays: true,
    records: true,
    references: true,
  },
  validators: {
    arrays: true,
    records: true,
    references: true,
  },
}

function common(config: PresetConfig): OpenAPIGenerator[] {
  return [
    generators.types({ documentation: config.documentation }),
    generators.typeValidators(config.validators),
    generators.typeGuards(config.typeGuards),
    generators.queryParameterTypes({ documentation: config.documentation }),
    generators.pathParameterTypes({ documentation: config.documentation }),
    generators.requestHeaderParameterTypes({ documentation: config.documentation }),
    generators.responseHeaderParameterTypes({ documentation: config.documentation }),
    generators.responseTypes(),
  ]
}

function serverOnly(config: PresetConfig): OpenAPIGenerator[] {
  return [
    generators.requestServerTypes(),
    generators.requestBodyValidators(),
    generators.responseHeaderParameterSerializers(),
    generators.pathParameterDeserializers(),
    generators.queryParameterDeserializers(),
    generators.requestHeaderParameterDeserializers(),
    generators.apiType({ documentation: config.documentation }),
    generators.expressRoute(),
    generators.expressRoutesType(),
    generators.expressRouteFactory(),
  ]
}

function clientOnly(config: PresetConfig): OpenAPIGenerator[] {
  return [
    generators.requestTypes(),
    generators.responseBodyValidators(),
    generators.responseHeaderParameterDeserializers(),
    generators.pathParameterSerializers(),
    generators.queryParameterSerializers(),
    generators.requestHeaderParameterSerializers(),
    generators.operations({ documentation: config.documentation, validate: config.validate }),
    generators.sdkType({ documentation: config.documentation }),
    generators.sdkStub(),
    generators.sdkImplementation({ documentation: config.documentation }),
  ]
}

function server(config: PresetConfig = DefaultPresetConfig): OpenAPIGenerator[] {
  return [...common(config), ...serverOnly(config)]
}

function client(config: PresetConfig = DefaultPresetConfig): OpenAPIGenerator[] {
  return [...common(config), ...clientOnly(config)]
}

function fullStack(config: PresetConfig = DefaultPresetConfig): OpenAPIGenerator[] {
  return [...common(config), ...serverOnly(config), ...clientOnly(config)]
}

export const presets = {
  client,
  server,
  fullStack,
}
