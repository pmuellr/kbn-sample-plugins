import { TypeOf, schema  } from '../../../../../kibana/packages/kbn-config-schema'

import {
  RouteConfig,
  KibanaRequest,
} from '../../../../../kibana/src/core/server'

import { RouteParams } from '.'

type BodyType = TypeOf<typeof BodySchema>
const BodySchema = schema.string()

const routeValidation = {
  body: BodySchema,
}

const routeConfig: RouteConfig<unknown, unknown, BodyType, any> = {
  path: '/_dev/epg/runs',
  validate: routeValidation,
}

// http body: "input 'hello' | slog"

export function registerRoute(params: RouteParams): void {
  const { plugin, router, expService } = params

  plugin.logger.info(`registering route POST ${routeConfig.path}`)

  router.post(routeConfig, async (
    reqContext,
    request: KibanaRequest<unknown, unknown, BodyType>,
    response,
  ) => {
    const reqExpService = plugin.getExpressionService()

    const expression = request.body

    // ast: string | ExpressionAstExpression, input: unknown, context?: Record<string, unknown>
    let runResult: unknown
    try {
      runResult = { result: await reqExpService.run(expression, null, {}) }
    } catch (err) {
      runResult = { error: `error running expression: ${err}`}
    }
  
    plugin.logger.debug(`expression: [${expression}] => ${JSON.stringify(runResult)}`)

    return response.ok({
      headers: {
        'content-type': 'application/json',
      },
      body: runResult
    })
  })
}
