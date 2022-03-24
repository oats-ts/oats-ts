import {
  DeleteMethodResponse,
  GetMethodResponse,
  HttpMethodsApi,
  OptionsMethodResponse,
  PatchMethodResponse,
  PostMethodResponse,
  PutMethodResponse,
} from '../../generated/methods'

export class HttpMethodsApiImpl implements HttpMethodsApi {
  async respond(methodUsed: string): Promise<GetMethodResponse> {
    return {
      mimeType: 'application/json',
      statusCode: 200,
      body: {
        methodUsed,
      },
    }
  }
  async deleteMethod(): Promise<DeleteMethodResponse> {
    return this.respond('delete')
  }
  async getMethod(): Promise<GetMethodResponse> {
    return this.respond('get')
  }
  async optionsMethod(): Promise<OptionsMethodResponse> {
    return this.respond('options')
  }
  async patchMethod(): Promise<PatchMethodResponse> {
    return this.respond('patch')
  }
  async postMethod(): Promise<PostMethodResponse> {
    return this.respond('post')
  }
  async putMethod(): Promise<PutMethodResponse> {
    return this.respond('put')
  }
}
