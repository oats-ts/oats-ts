import { ExpressRouterFactoriesDefaultLocals } from './ExpressRouterFactoriesDefaultLocals'

export type ExpressRouterFactoriesGeneratorConfig = {
  /**
   * When enabled, the generatated Router will access the appropriate CORS configuration,
   * and use it in response headers.
   */
  cors: boolean
}

export type ExpressRouterFactoriesLocals = keyof typeof ExpressRouterFactoriesDefaultLocals
