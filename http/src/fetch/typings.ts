import { ResponseBody } from '..'

export type FetchAdapterConfig = {
  parse?(response: Response): Promise<ResponseBody>
  init?: RequestInit
}
