import { schema } from '@kbn/config-schema';

import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Logger,
} from '../../../src/core/server';

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
    this.logger.info('initializing!')
  }

  async setup(core: CoreSetup) {
    this.logger.info('setting up!');

    const router = core.http.createRouter();
    registerRoutes(this, router);
  }

  async start(core: CoreStart) {
    this.logger.info('starting!');
  }

  async stop() {
    this.logger.info('stopping!');
  }
}