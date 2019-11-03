import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Logger,
  IRouter,
} from '../../../src/core/server';

import { registerRoutes } from './routes';
import { Router } from '../../../src/core/server/http/router';

export interface IContext {
  logger: Logger;
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
    registerRoutes(router, this);
  }

  async start(core: CoreStart) {
    this.logger.info('starting!');
  }

  async stop() {
    this.logger.info('stopping!');
  }
}