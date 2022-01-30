import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
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

export class HttpMethodsApiImpl implements HttpMethodsApi<ExpressToolkit> {
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
  async deleteMethod({ request }: ExpressToolkit): Promise<DeleteMethodResponse> {
    return this.respond(request)
  }
  async getMethod({ request }: ExpressToolkit): Promise<GetMethodResponse> {
    return this.respond(request)
  }
  async optionsMethod({ request }: ExpressToolkit): Promise<OptionsMethodResponse> {
    return this.respond(request)
  }
  async patchMethod({ request }: ExpressToolkit): Promise<PatchMethodResponse> {
    return this.respond(request)
  }
  async postMethod({ request }: ExpressToolkit): Promise<PostMethodResponse> {
    return this.respond(request)
  }
  async putMethod({ request }: ExpressToolkit): Promise<PutMethodResponse> {
    return this.respond(request)
  }
}
