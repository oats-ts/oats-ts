import { OpenAPIObject } from '@oats-ts/openapi-model'
import { isSuccess, Try } from '@oats-ts/try'
import { OpenAPIReadConfig } from '../typings'

export const createResolver =
  ({ parse, read }: OpenAPIReadConfig) =>
  async (uri: string): Promise<Try<OpenAPIObject>> => {
    const content = await read(uri)
    if (!isSuccess(content)) {
      return content
    }
    return parse(uri, content.data)
  }
