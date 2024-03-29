/*
 * This file has been generated by Oats, please don't modify it by hand!
 *
 * Generated from generated-schemas/bodies.json (originating from oats-ts/oats-schemas)
 */

import { ExpressToolkit } from '@oats-ts/openapi-express-server-adapter'
import { ServerAdapter } from '@oats-ts/openapi-runtime'
import { IRouter, NextFunction, Request, Response, Router } from 'express'
import { bodiesCorsConfiguration } from './corsConfiguration'

export function createBodiesCorsRouter(router?: IRouter | undefined): IRouter {
  return (router ?? Router())
    .options('/nested-obj', async (request: Request, response: Response, next: NextFunction) => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_1qzwl9e']
      try {
        const method = adapter.getAccessControlRequestedMethod(toolkit)
        const corsConfig = method === undefined ? undefined : bodiesCorsConfiguration?.['/nested-obj']?.[method]
        const corsHeaders = await adapter.getPreflightCorsHeaders(toolkit, method, corsConfig)
        await adapter.respond(toolkit, { headers: corsHeaders })
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    })
    .options('/arr-obj', async (request: Request, response: Response, next: NextFunction) => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_1qzwl9e']
      try {
        const method = adapter.getAccessControlRequestedMethod(toolkit)
        const corsConfig = method === undefined ? undefined : bodiesCorsConfiguration?.['/arr-obj']?.[method]
        const corsHeaders = await adapter.getPreflightCorsHeaders(toolkit, method, corsConfig)
        await adapter.respond(toolkit, { headers: corsHeaders })
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    })
    .options('/nullable-prim-obj', async (request: Request, response: Response, next: NextFunction) => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_1qzwl9e']
      try {
        const method = adapter.getAccessControlRequestedMethod(toolkit)
        const corsConfig = method === undefined ? undefined : bodiesCorsConfiguration?.['/nullable-prim-obj']?.[method]
        const corsHeaders = await adapter.getPreflightCorsHeaders(toolkit, method, corsConfig)
        await adapter.respond(toolkit, { headers: corsHeaders })
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    })
    .options('/prim-obj', async (request: Request, response: Response, next: NextFunction) => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_1qzwl9e']
      try {
        const method = adapter.getAccessControlRequestedMethod(toolkit)
        const corsConfig = method === undefined ? undefined : bodiesCorsConfiguration?.['/prim-obj']?.[method]
        const corsHeaders = await adapter.getPreflightCorsHeaders(toolkit, method, corsConfig)
        await adapter.respond(toolkit, { headers: corsHeaders })
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    })
    .options('/bool-arr', async (request: Request, response: Response, next: NextFunction) => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_1qzwl9e']
      try {
        const method = adapter.getAccessControlRequestedMethod(toolkit)
        const corsConfig = method === undefined ? undefined : bodiesCorsConfiguration?.['/bool-arr']?.[method]
        const corsHeaders = await adapter.getPreflightCorsHeaders(toolkit, method, corsConfig)
        await adapter.respond(toolkit, { headers: corsHeaders })
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    })
    .options('/enm-arr', async (request: Request, response: Response, next: NextFunction) => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_1qzwl9e']
      try {
        const method = adapter.getAccessControlRequestedMethod(toolkit)
        const corsConfig = method === undefined ? undefined : bodiesCorsConfiguration?.['/enm-arr']?.[method]
        const corsHeaders = await adapter.getPreflightCorsHeaders(toolkit, method, corsConfig)
        await adapter.respond(toolkit, { headers: corsHeaders })
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    })
    .options('/num-arr', async (request: Request, response: Response, next: NextFunction) => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_1qzwl9e']
      try {
        const method = adapter.getAccessControlRequestedMethod(toolkit)
        const corsConfig = method === undefined ? undefined : bodiesCorsConfiguration?.['/num-arr']?.[method]
        const corsHeaders = await adapter.getPreflightCorsHeaders(toolkit, method, corsConfig)
        await adapter.respond(toolkit, { headers: corsHeaders })
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    })
    .options('/str-arr', async (request: Request, response: Response, next: NextFunction) => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_1qzwl9e']
      try {
        const method = adapter.getAccessControlRequestedMethod(toolkit)
        const corsConfig = method === undefined ? undefined : bodiesCorsConfiguration?.['/str-arr']?.[method]
        const corsHeaders = await adapter.getPreflightCorsHeaders(toolkit, method, corsConfig)
        await adapter.respond(toolkit, { headers: corsHeaders })
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    })
    .options('/opt-prim-tuple', async (request: Request, response: Response, next: NextFunction) => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_1qzwl9e']
      try {
        const method = adapter.getAccessControlRequestedMethod(toolkit)
        const corsConfig = method === undefined ? undefined : bodiesCorsConfiguration?.['/opt-prim-tuple']?.[method]
        const corsHeaders = await adapter.getPreflightCorsHeaders(toolkit, method, corsConfig)
        await adapter.respond(toolkit, { headers: corsHeaders })
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    })
    .options('/prim-tuple', async (request: Request, response: Response, next: NextFunction) => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_1qzwl9e']
      try {
        const method = adapter.getAccessControlRequestedMethod(toolkit)
        const corsConfig = method === undefined ? undefined : bodiesCorsConfiguration?.['/prim-tuple']?.[method]
        const corsHeaders = await adapter.getPreflightCorsHeaders(toolkit, method, corsConfig)
        await adapter.respond(toolkit, { headers: corsHeaders })
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    })
    .options('/bool', async (request: Request, response: Response, next: NextFunction) => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_1qzwl9e']
      try {
        const method = adapter.getAccessControlRequestedMethod(toolkit)
        const corsConfig = method === undefined ? undefined : bodiesCorsConfiguration?.['/bool']?.[method]
        const corsHeaders = await adapter.getPreflightCorsHeaders(toolkit, method, corsConfig)
        await adapter.respond(toolkit, { headers: corsHeaders })
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    })
    .options('/enm', async (request: Request, response: Response, next: NextFunction) => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_1qzwl9e']
      try {
        const method = adapter.getAccessControlRequestedMethod(toolkit)
        const corsConfig = method === undefined ? undefined : bodiesCorsConfiguration?.['/enm']?.[method]
        const corsHeaders = await adapter.getPreflightCorsHeaders(toolkit, method, corsConfig)
        await adapter.respond(toolkit, { headers: corsHeaders })
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    })
    .options('/num', async (request: Request, response: Response, next: NextFunction) => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_1qzwl9e']
      try {
        const method = adapter.getAccessControlRequestedMethod(toolkit)
        const corsConfig = method === undefined ? undefined : bodiesCorsConfiguration?.['/num']?.[method]
        const corsHeaders = await adapter.getPreflightCorsHeaders(toolkit, method, corsConfig)
        await adapter.respond(toolkit, { headers: corsHeaders })
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    })
    .options('/str', async (request: Request, response: Response, next: NextFunction) => {
      const toolkit: ExpressToolkit = { request, response, next }
      const adapter: ServerAdapter<ExpressToolkit> = response.locals['__oats_adapter_1qzwl9e']
      try {
        const method = adapter.getAccessControlRequestedMethod(toolkit)
        const corsConfig = method === undefined ? undefined : bodiesCorsConfiguration?.['/str']?.[method]
        const corsHeaders = await adapter.getPreflightCorsHeaders(toolkit, method, corsConfig)
        await adapter.respond(toolkit, { headers: corsHeaders })
      } catch (error) {
        adapter.handleError(toolkit, error)
      }
    })
}
