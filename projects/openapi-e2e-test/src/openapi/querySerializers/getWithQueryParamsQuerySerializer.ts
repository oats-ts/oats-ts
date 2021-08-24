import { query, createQuerySerializer } from '@oats-ts/openapi-parameter-serialization'
import { GetWithQueryParamsQueryParameters } from '../queryTypes/GetWithQueryParamsQueryParameters'

export const getWithQueryParamsQuerySerializer = createQuerySerializer<GetWithQueryParamsQueryParameters>({
  stringInQuery: query.form.primitive({ required: true }),
  numberInQuery: query.form.primitive({ required: true }),
  booleanInQuery: query.form.primitive({ required: true }),
  enumInQuery: query.form.primitive({ required: true }),
})
