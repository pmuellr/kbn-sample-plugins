import { TypeOf, schema  } from '../../../../../kibana/packages/kbn-config-schema'

import {
  RouteConfig,
  KibanaRequest,
} from '../../../../../kibana/src/core/server'

import { RouteParams } from '.'

type BodyType = TypeOf<typeof BodySchema>
const BodySchema = schema.object({
  expression: schema.string(),
  input: schema.any(),
  context: schema.maybe(schema.recordOf(schema.string(), schema.any())),
})

const routeValidation = {
  body: BodySchema,
}

const routeConfig: RouteConfig<unknown, unknown, BodyType, any> = {
  path: '/_dev/epg/run',
  validate: routeValidation,
}

export function registerRoute(params: RouteParams): void {
  const { plugin, router, expService } = params

  plugin.logger.info(`registering route POST ${routeConfig.path}`)

  router.post(routeConfig, async (
    reqContext,
    request: KibanaRequest<unknown, unknown, BodyType>,
    response,
  ) => {
    const reqExpService = plugin.getExpressionService()

    const {expression, input, context } = request.body

    // ast: string | ExpressionAstExpression, input: unknown, context?: Record<string, unknown>
    const runResult = reqExpService.run(expression, input, context)

    return response.ok({
      headers: {
        'content-type': 'application/json',
      },
      body: {
        ...runResult,
      },
    })
  })
}
