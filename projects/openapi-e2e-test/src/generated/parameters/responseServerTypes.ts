/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/parameters.json (originating from oats-ts/oats-schemas)
 */

import { Cookies as _Cookies } from '@oats-ts/openapi-runtime'
import { FormCookieParametersCookieParameters } from './cookieTypes'
import { SimpleResponseHeaderParameters200ResponseHeaderParameters } from './responseHeaderTypes'
import {
  DeepObjectQueryParameters,
  FormCookieParameters,
  FormQueryParameters,
  LabelPathParameters,
  MatrixPathParameters,
  ParameterIssue,
  PipeDelimitedQueryParameters,
  SimpleHeaderParameters,
  SimplePathParameters,
  SpaceDelimitedQueryParameters,
} from './types'

export type DeepObjectQueryParametersServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: DeepObjectQueryParameters
    }
  | {
      statusCode: 400
      mimeType: 'application/json'
      body: ParameterIssue[]
    }

export type FormCookieParametersServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: FormCookieParameters
      cookies?: _Cookies<FormCookieParametersCookieParameters>
    }
  | {
      statusCode: 400
      mimeType: 'application/json'
      body: ParameterIssue[]
      cookies?: _Cookies<FormCookieParametersCookieParameters>
    }

export type FormQueryParametersServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: FormQueryParameters
    }
  | {
      statusCode: 400
      mimeType: 'application/json'
      body: ParameterIssue[]
    }

export type LabelPathParametersServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: LabelPathParameters
    }
  | {
      statusCode: 400
      mimeType: 'application/json'
      body: ParameterIssue[]
    }

export type MatrixPathParametersServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: MatrixPathParameters
    }
  | {
      statusCode: 400
      mimeType: 'application/json'
      body: ParameterIssue[]
    }

export type PipeDelimitedQueryParametersServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: PipeDelimitedQueryParameters
    }
  | {
      statusCode: 400
      mimeType: 'application/json'
      body: ParameterIssue[]
    }

export type SimpleHeaderParametersServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: SimpleHeaderParameters
    }
  | {
      statusCode: 400
      mimeType: 'application/json'
      body: ParameterIssue[]
    }

export type SimplePathParametersServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: SimplePathParameters
    }
  | {
      statusCode: 400
      mimeType: 'application/json'
      body: ParameterIssue[]
    }

export type SimpleResponseHeaderParametersServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: {
        ok: boolean
      }
      headers: SimpleResponseHeaderParameters200ResponseHeaderParameters
    }
  | {
      statusCode: 400
      mimeType: 'application/json'
      body: ParameterIssue[]
    }

export type SpaceDelimitedQueryParametersServerResponse =
  | {
      statusCode: 200
      mimeType: 'application/json'
      body: SpaceDelimitedQueryParameters
    }
  | {
      statusCode: 400
      mimeType: 'application/json'
      body: ParameterIssue[]
    }
