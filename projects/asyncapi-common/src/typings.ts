import { TypeScriptModule } from '@oats-ts/typescript-writer'
import { CodeGenerator } from '@oats-ts/generator'
import { AsyncAPIGeneratorTarget } from '@oats-ts/asyncapi'
import { AsyncApiObject, ChannelItemObject } from '../../asyncapi-model'
import { GeneratorContext } from '@oats-ts/model-common'
import { AsyncAPIReadOutput } from '@oats-ts/asyncapi-reader'

export type AsyncAPIGeneratorContext = GeneratorContext<AsyncApiObject, AsyncAPIGeneratorTarget>

export type AsyncAPIGenerator = CodeGenerator<AsyncAPIReadOutput, TypeScriptModule>

export type EnhancedChannel = {
  channel: ChannelItemObject
  url: string
}
