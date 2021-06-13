import { ObjectProperty, objectProperty, identifier } from '@babel/types'
import { entries } from 'lodash'
import { ResponseObject } from 'openapi3-ts/dist/model/OpenApi'
import { OpenAPIGeneratorContext } from '../..'
import { idAst } from '../../common/babelUtils'

export function getContentValidatorPropertyAsts(
  data: ResponseObject,
  context: OpenAPIGeneratorContext,
): ObjectProperty[] {
  const { content } = data
  return entries(content || {}).map(([contentType]) => objectProperty(idAst(contentType), identifier('undefined')))
}
