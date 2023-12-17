/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from schemas/pet-store-json.json (originating from oats-ts/oats-schemas)
 */

import { ClientAdapter, RunnableOperation } from '@oats-ts/openapi-runtime'
import { CreatePetsOperation, ListPetsOperation, ShowPetByIdOperation } from './operations'
import { CreatePetsRequest, ListPetsRequest, ShowPetByIdRequest } from './requestTypes'
import { CreatePetsResponse, ListPetsResponse, ShowPetByIdResponse } from './responseTypes'
import { SwaggerPetstoreJsonSdk } from './sdkType'

export class SwaggerPetstoreJsonSdkImpl implements SwaggerPetstoreJsonSdk {
  protected readonly _local_adapter: ClientAdapter
  public constructor(_local_adapter: ClientAdapter) {
    this._local_adapter = _local_adapter
  }
  public async _local_createPets(_local_request: CreatePetsRequest): Promise<CreatePetsResponse> {
    return this._local_createCreatePetsOperation().run(_local_request)
  }
  public async _local_listPets(_local_request: ListPetsRequest): Promise<ListPetsResponse> {
    return this._local_createListPetsOperation().run(_local_request)
  }
  public async _local_showPetById(_local_request: ShowPetByIdRequest): Promise<ShowPetByIdResponse> {
    return this._local_createShowPetByIdOperation().run(_local_request)
  }
  protected _local_createCreatePetsOperation(): RunnableOperation<CreatePetsRequest, CreatePetsResponse> {
    return new CreatePetsOperation(this._local_adapter)
  }
  protected _local_createListPetsOperation(): RunnableOperation<ListPetsRequest, ListPetsResponse> {
    return new ListPetsOperation(this._local_adapter)
  }
  protected _local_createShowPetByIdOperation(): RunnableOperation<ShowPetByIdRequest, ShowPetByIdResponse> {
    return new ShowPetByIdOperation(this._local_adapter)
  }
}
