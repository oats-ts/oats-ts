import { ResponseBody } from '../..'

export async function defaultParseResponse(response: Response): Promise<ResponseBody> {
  return response.blob()
}
