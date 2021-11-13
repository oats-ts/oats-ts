import { ExpressParameters } from '@oats-ts/openapi-http-server/lib/express'
import { Request } from 'express'
import {
  DeleteMethodResponse,
  GetMethodResponse,
  HttpMethodsApi,
  OptionsMethodResponse,
  PatchMethodResponse,
  PostMethodResponse,
  PutMethodResponse,
} from '../../generated/HttpMethods'

export class HttpMethodsApiImpl implements HttpMethodsApi<ExpressParameters> {
  async respond(request: Request): Promise<GetMethodResponse> {
    return {
      mimeType: 'application/json',
      headers: undefined,
      statusCode: 200,
      body: {
        methodUsed: request.method,
      },
    }
  }
  async deleteMethod({ request }: ExpressParameters): Promise<DeleteMethodResponse> {
    return this.respond(request)
  }
  async getMethod({ request }: ExpressParameters): Promise<GetMethodResponse> {
    return this.respond(request)
  }
  async optionsMethod({ request }: ExpressParameters): Promise<OptionsMethodResponse> {
    return this.respond(request)
  }
  async patchMethod({ request }: ExpressParameters): Promise<PatchMethodResponse> {
    return this.respond(request)
  }
  async postMethod({ request }: ExpressParameters): Promise<PostMethodResponse> {
    return this.respond(request)
  }
  async putMethod({ request }: ExpressParameters): Promise<PutMethodResponse> {
    return this.respond(request)
  }
}
