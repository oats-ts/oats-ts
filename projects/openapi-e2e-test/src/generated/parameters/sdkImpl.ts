/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from https://raw.githubusercontent.com/oats-ts/oats-schemas/master/generated-schemas/parameters.json
 */

import { ClientAdapter } from '@oats-ts/openapi-http'
import {
  deepObjectQueryParameters,
  formCookieParameters,
  formQueryParameters,
  labelPathParameters,
  matrixPathParameters,
  pipeDelimitedQueryParameters,
  simpleHeaderParameters,
  simplePathParameters,
  simpleResponseHeaderParameters,
  spaceDelimitedQueryParameters,
} from './operations'
import {
  DeepObjectQueryParametersRequest,
  FormCookieParametersRequest,
  FormQueryParametersRequest,
  LabelPathParametersRequest,
  MatrixPathParametersRequest,
  PipeDelimitedQueryParametersRequest,
  SimpleHeaderParametersRequest,
  SimplePathParametersRequest,
  SimpleResponseHeaderParametersRequest,
  SpaceDelimitedQueryParametersRequest,
} from './requestTypes'
import {
  DeepObjectQueryParametersResponse,
  FormCookieParametersResponse,
  FormQueryParametersResponse,
  LabelPathParametersResponse,
  MatrixPathParametersResponse,
  PipeDelimitedQueryParametersResponse,
  SimpleHeaderParametersResponse,
  SimplePathParametersResponse,
  SimpleResponseHeaderParametersResponse,
  SpaceDelimitedQueryParametersResponse,
} from './responseTypes'
import { ParametersSdk } from './sdkType'

export class ParametersSdkImpl implements ParametersSdk {
  protected readonly adapter: ClientAdapter
  public constructor(adapter: ClientAdapter) {
    this.adapter = adapter
  }
  public async simplePathParameters(request: SimplePathParametersRequest): Promise<SimplePathParametersResponse> {
    return simplePathParameters(request, this.adapter)
  }
  public async labelPathParameters(request: LabelPathParametersRequest): Promise<LabelPathParametersResponse> {
    return labelPathParameters(request, this.adapter)
  }
  public async matrixPathParameters(request: MatrixPathParametersRequest): Promise<MatrixPathParametersResponse> {
    return matrixPathParameters(request, this.adapter)
  }
  public async formQueryParameters(request: FormQueryParametersRequest): Promise<FormQueryParametersResponse> {
    return formQueryParameters(request, this.adapter)
  }
  public async spaceDelimitedQueryParameters(
    request: SpaceDelimitedQueryParametersRequest,
  ): Promise<SpaceDelimitedQueryParametersResponse> {
    return spaceDelimitedQueryParameters(request, this.adapter)
  }
  public async pipeDelimitedQueryParameters(
    request: PipeDelimitedQueryParametersRequest,
  ): Promise<PipeDelimitedQueryParametersResponse> {
    return pipeDelimitedQueryParameters(request, this.adapter)
  }
  public async deepObjectQueryParameters(
    request: DeepObjectQueryParametersRequest,
  ): Promise<DeepObjectQueryParametersResponse> {
    return deepObjectQueryParameters(request, this.adapter)
  }
  public async simpleHeaderParameters(request: SimpleHeaderParametersRequest): Promise<SimpleHeaderParametersResponse> {
    return simpleHeaderParameters(request, this.adapter)
  }
  public async formCookieParameters(request: FormCookieParametersRequest): Promise<FormCookieParametersResponse> {
    return formCookieParameters(request, this.adapter)
  }
  public async simpleResponseHeaderParameters(
    request: SimpleResponseHeaderParametersRequest,
  ): Promise<SimpleResponseHeaderParametersResponse> {
    return simpleResponseHeaderParameters(request, this.adapter)
  }
}