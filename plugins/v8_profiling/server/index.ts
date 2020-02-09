import { schema  } from '../../../../kibana/packages/kbn-config-schema';

import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Logger,
} from '../../../../kibana/src/core/server';

import { registerRoutes } from './routes';

export const config = {
  schema: schema.object({
    enabled: schema.boolean({ defaultValue: true }),
  })
}

export function plugin(initializerContext: PluginInitializerContext) {
  return new Plugin(initializerContext)
}

export class Plugin {
  readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get()
  }

  async setup(core: CoreSetup) {
    const router = core.http.createRouter();
    registerRoutes(this, router);
  }

  async start(core: CoreStart) {
  }

  async stop() {
  }
}