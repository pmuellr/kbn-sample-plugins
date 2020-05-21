import { schema  } from '../../../../../kibana/packages/kbn-config-schema';

import { IRouter } from '../../../../../kibana/src/core/server';
import { Plugin } from '../index';

const routeValidation = {
  query: schema.object({
    millis: schema.number(),
  }),
};

const routeConfig = {
  path: '/_dev/eat_cpu',
  validate: routeValidation,
};

export function registerRoute(plugin: Plugin, router: IRouter): void {
  plugin.logger.info(`registering route POST ${routeConfig.path}?millis=nnn`)

  router.post(routeConfig, async (
    context,
    request,
    response,
  ) => {
    const millis = request.query.millis || 1000;

    plugin.logger.info(`blocking the event loop for ${millis} ms ...`);
    const eaten = eatCPU(millis);
    plugin.logger.info(`done blocking the event loop for ${eaten} ms ... `);

    return response.ok({
      headers: {
        'content-type': 'application/json',
      },
      body: {
        requested: millis,
        actual: eaten,
      },
    });
  });
}

function eatCPU(millis: number): number {
  const start = Date.now()
  const done = start + millis

  while(true) {
    if (Date.now() > done) break
    
  }

  return Date.now() - start
}
