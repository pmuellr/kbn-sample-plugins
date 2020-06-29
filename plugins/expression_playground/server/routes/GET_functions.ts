import {
  RouteConfig,
  KibanaRequest,
} from '../../../../../kibana/src/core/server'

import { RouteParams } from '.'

const routeConfig: RouteConfig<unknown, unknown, unknown, any> = {
  path: '/_dev/epg/functions',
  validate: {},
}

export function registerRoute(params: RouteParams): void {
  const { plugin, router, expService } = params

  plugin.logger.info(`registering route GET ${routeConfig.path}`)

  router.get(routeConfig, async (
    reqContext,
    request: KibanaRequest<unknown, unknown, unknown>,
    response,
  ) => {
    const functions = plugin.getExpressionService().getFunctions()

    return response.ok({
      headers: {
        'content-type': 'application/json',
      },
      body: {
        ...functions,
      },
    })
  })
}
