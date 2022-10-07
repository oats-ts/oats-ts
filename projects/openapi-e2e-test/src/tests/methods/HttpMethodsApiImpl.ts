import { HttpMethodsApi } from '../../generated/methods/apiType'
import {
  GetMethodServerResponse,
  PostMethodServerResponse,
  PutMethodServerResponse,
  PatchMethodServerResponse,
  DeleteMethodServerResponse,
} from '../../generated/methods/responseServerTypes'

export class HttpMethodsApiImpl implements HttpMethodsApi {
  async respond(methodUsed: string): Promise<GetMethodServerResponse> {
    return {
      mimeType: 'application/json',
      statusCode: 200,
      body: {
        methodUsed,
      },
    }
  }
  async deleteMethod(): Promise<DeleteMethodServerResponse> {
    return this.respond('delete')
  }
  async getMethod(): Promise<GetMethodServerResponse> {
    return this.respond('get')
  }
  async patchMethod(): Promise<PatchMethodServerResponse> {
    console.log("hitting patch")
    return this.respond('patch')
  }
  async postMethod(): Promise<PostMethodServerResponse> {
    return this.respond('post')
  }
  async putMethod(): Promise<PutMethodServerResponse> {
    return this.respond('put')
  }
}
