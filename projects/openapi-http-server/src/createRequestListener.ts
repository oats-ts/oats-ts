import { ServerConfiguration } from '@oats-ts/openapi-http'
import { TypedRequest } from './internalTypings'
import { PathConfiguration } from './typings'

export function createRequestListener<Req, Res, T extends Record<string, PathConfiguration>>(
  config: ServerConfiguration<Req, Res>,
  paths: T,
) {
  const pathList = Object.values(paths)
  return async function listener(req: Req, res: Res): Promise<void> {
    const rawRequest = await config.getRequest(req)
    const path = await config.getPath(rawRequest)
    for (let i = 0, len = pathList.length; i < len; i += 1) {
      const {
        handle,
        matches,
        deserializePath,
        deserializeQuery,
        deserializeRequestHeaders,
        serializeResponseHeaders,
      } = pathList[i]
      if (matches(rawRequest.method, path)) {
        // Build all the parameters for the typed handler
        const requestMimeType = rawRequest.headers?.contentType
        const path =
          deserializePath === null || deserializePath === undefined
            ? undefined
            : deserializePath(await config.getPath(rawRequest))
        const query =
          deserializeQuery === null || deserializeQuery === undefined
            ? undefined
            : deserializeQuery(await config.getQuery(rawRequest))
        const requestHeaders =
          deserializeRequestHeaders === null || deserializeRequestHeaders === undefined
            ? undefined
            : deserializeRequestHeaders(await config.getRequestHeaders(rawRequest))
        const requestBody =
          rawRequest.body === null || rawRequest.body === undefined
            ? undefined
            : await config.deserializeRequestBody(requestMimeType, rawRequest.body)

        const typedRequest: TypedRequest = {
          path,
          query,
          body: requestBody,
          headers: requestHeaders,
          mimeType: requestMimeType,
        }

        // Let the handler run
        const typedResponse = await handle(typedRequest)

        // Convert it to raw, serialized format & return
        const responseBody =
          typedResponse.body === null || typedResponse.body === undefined
            ? undefined
            : await config.serializeResponseBody(typedResponse.mimeType, typedResponse.body)

        const responseHeaders =
          serializeResponseHeaders === null || serializeResponseHeaders === undefined
            ? undefined
            : serializeResponseHeaders(typedResponse.headers)

        await config.respond(res, {
          body: responseBody,
          headers: responseHeaders,
          statusCode: typedResponse.statusCode,
        })

        return
      }
    }
  }
}
