import { OpenAPIReadOutput } from '@oats-ts/openapi-reader'
import { OpenAPIGeneratorContext, createOpenAPIGeneratorContext, OpenAPIGeneratorTarget } from '@oats-ts/openapi-common'
import { BaseCodeGenerator, GeneratorInit } from '@oats-ts/oats-ts'
import { SourceFile } from 'typescript'
import {
  ExpressPackage,
  OpenApiHttpPackage,
  OpenApiParameterSerializationPackage,
  ValidatorsPackage,
  TryPackage,
  OpenAPIRuntimePackage,
  OpenApiExpressServerAdapterPackage,
  RuntimePackage,
  packages,
  LocalNameDefaults,
} from '@oats-ts/model-common'

export abstract class OpenAPIGenerator<Config, Items> extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  Config,
  Items,
  OpenAPIGeneratorContext
> {
  public abstract name(): OpenAPIGeneratorTarget
  public abstract consumes(): OpenAPIGeneratorTarget[]

  protected validatorsPkg!: ValidatorsPackage
  protected httpPkg!: OpenApiHttpPackage
  protected paramsPkg!: OpenApiParameterSerializationPackage
  protected expressPkg!: ExpressPackage
  protected tryPkg!: TryPackage
  protected runtimePkg!: OpenAPIRuntimePackage
  protected adapterPkg!: OpenApiExpressServerAdapterPackage
  protected fetchPkg!: RuntimePackage<any, any>

  protected getDefaultLocals(): LocalNameDefaults {
    return {}
  }

  protected createContext(): OpenAPIGeneratorContext {
    return createOpenAPIGeneratorContext(
      this,
      this.input,
      this.globalConfig,
      this.dependencies,
      this.getDefaultLocals(),
    )
  }

  public initialize(init: GeneratorInit<OpenAPIReadOutput, SourceFile>): void {
    super.initialize(init)
    this.validatorsPkg = this.getValidatorPackage()
    this.httpPkg = this.getOpenApiHttpPackage()
    this.paramsPkg = this.getOpenApiParameterSerializationPackage()
    this.expressPkg = this.createExpressPackage()
    this.tryPkg = this.getTryPackage()
    this.runtimePkg = this.getOpenAPIRuntimePackage()
    this.adapterPkg = this.getOpenApiExpressServerAdapterPackage()
    this.fetchPkg = this.getFetchPackage()
  }

  protected getValidatorPackage(): ValidatorsPackage {
    return this.getOpenAPIRuntimePackage()
  }

  protected getOpenApiHttpPackage(): OpenApiHttpPackage {
    return this.getOpenAPIRuntimePackage()
  }

  protected getOpenApiParameterSerializationPackage(): OpenApiParameterSerializationPackage {
    return this.getOpenAPIRuntimePackage()
  }

  protected getTryPackage(): TryPackage {
    return this.getOpenAPIRuntimePackage()
  }

  protected getOpenAPIRuntimePackage(): OpenAPIRuntimePackage {
    return packages.openApiRuntime(this.context())
  }

  protected createExpressPackage(): ExpressPackage {
    return packages.express(this.context())
  }

  protected getOpenApiExpressServerAdapterPackage(): OpenApiExpressServerAdapterPackage {
    return packages.openApiExpressServerAdapter(this.context())
  }

  protected getFetchPackage(): RuntimePackage<any, any> {
    return packages.openApiFetchClientAdapter(this.context())
  }
}
