import {
  OpenAPIGeneratorContext,
  createOpenAPIGeneratorContext,
  OpenAPIGeneratorTarget,
  OpenAPIReadOutput,
  RulesPackage,
  ExpressPackage,
  OpenApiHttpPackage,
  OpenApiParameterSerializationPackage,
  TryPackage,
  OpenAPIRuntimePackage,
  OpenApiExpressServerAdapterPackage,
  RuntimePackage,
  packages,
  LocalNameDefaults,
} from '@oats-ts/openapi-common'
import { BaseCodeGenerator, GeneratorInit } from '@oats-ts/oats-ts'
import { SourceFile } from 'typescript'

export abstract class OpenAPICodeGeneratorImpl<Config, Items> extends BaseCodeGenerator<
  OpenAPIReadOutput,
  SourceFile,
  Config,
  Items,
  OpenAPIGeneratorContext
> {
  public abstract name(): OpenAPIGeneratorTarget
  public abstract consumes(): OpenAPIGeneratorTarget[]

  protected httpPkg!: OpenApiHttpPackage
  protected paramsPkg!: OpenApiParameterSerializationPackage
  protected expressPkg!: ExpressPackage
  protected tryPkg!: TryPackage
  protected runtimePkg!: OpenAPIRuntimePackage
  protected adapterPkg!: OpenApiExpressServerAdapterPackage
  protected rulesPkg!: RulesPackage
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
    this.httpPkg = this.getOpenApiHttpPackage()
    this.paramsPkg = this.getOpenApiParameterSerializationPackage()
    this.expressPkg = this.createExpressPackage()
    this.tryPkg = this.getTryPackage()
    this.runtimePkg = this.getOpenAPIRuntimePackage()
    this.adapterPkg = this.getOpenApiExpressServerAdapterPackage()
    this.fetchPkg = this.getFetchPackage()
    this.rulesPkg = this.getRulesPackage()
  }

  protected getRulesPackage(): RulesPackage {
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
