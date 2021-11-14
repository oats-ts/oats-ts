import { Request, Response, NextFunction, Handler } from 'express'
import { isNil } from 'lodash'
import { Writable } from 'stream'
import YAML from 'yamljs'

export const stringBasedBodyParser =
  (accept: (mimeType: string) => boolean, parse: (input: string) => any): Handler =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const mimeType = req.header('content-type')
    if (!isNil(mimeType) && accept(mimeType.toLowerCase())) {
      const buffers: any[] = []
      req.pipe(
        new Writable({
          write(chunk, _encoding, callback) {
            buffers.push(chunk)
            callback()
          },
          final() {
            try {
              req.body = parse(Buffer.concat(buffers).toString())
              next()
            } catch (e) {
              next(e)
            }
          },
        }),
      )
    } else {
      next()
    }
  }

const json = () =>
  stringBasedBodyParser(
    (mimeType) => mimeType.indexOf('json') >= 0,
    (input: string) => JSON.parse(input),
  )
const yaml = () =>
  stringBasedBodyParser(
    (mimeType) => mimeType.indexOf('yaml') >= 0,
    (input: string) => YAML.parse(input),
  )

export const customBodyParsers = {
  yaml,
  json,
}
