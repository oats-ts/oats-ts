import { ServerConfiguration } from '@oats-ts/openapi-http'
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
      const { handle, matches } = pathList[i]
      if (matches(rawRequest.method, path)) {
        const rawResponse = await handle(rawRequest)
        await config.respond(res, rawResponse)
        return
      }
    }
  }
}
