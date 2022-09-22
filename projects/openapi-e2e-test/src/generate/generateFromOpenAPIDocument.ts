import { generate } from '@oats-ts/oats-ts'
import {
  formatters,
  validator,
  readers,
  writers,
  presets,
  nameProviders,
  pathProviders,
  generator,
  loggers,
} from '@oats-ts/openapi'

function getCorsConfig(url: string) {
  if (url.includes('pet-store-json')) {
    return true
  }
  if (url.includes('pet-store-yaml')) {
    return ['https://foo.com']
  }
  return false
}

export async function generateFromOpenAPIDocument(
  url: string,
  codePath: string,
  pathProviderKind: Exclude<keyof typeof pathProviders, 'delegating'>,
) {
  try {
    await generate({
      logger: loggers.simple(),
      validator: validator(),
      reader: readers.https.mixed(url),
      generator: generator({
        nameProvider: nameProviders.default(),
        pathProvider: pathProviders[pathProviderKind](codePath),
        children: presets.fullStack({
          sendCookieHeader: true,
          parseSetCookieHeaders: true,
          overrides: {
            'oats/express-router': {
              cors: getCorsConfig(url),
            },
            'oats/type-guard': {
              ignore: (schema: any) => Boolean(schema?.['x-ignore-validation']),
            },
            'oats/type-validator': {
              ignore: (schema: any) => Boolean(schema?.['x-ignore-validation']),
            },
          },
        }),
      }),
      writer: writers.typescript.file({
        format: formatters.prettier({
          parser: 'typescript',
          arrowParens: 'always',
          printWidth: 120,
          semi: false,
          singleQuote: true,
          trailingComma: 'all',
        }),
        comments: {
          leadingComments: [
            {
              type: 'block',
              text: `This file has been generated by Oats, please don't modify it by hand!\n\nGenerated from ${url}`,
            },
          ],
        },
      }),
    })
  } catch (e) {
    console.error(codePath, url)
    console.error('thrown', e, typeof e)
  }
}