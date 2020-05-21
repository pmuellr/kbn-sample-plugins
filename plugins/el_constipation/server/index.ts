import { first } from '../../../../kibana/node_modules/rxjs/operators';

import { schema, TypeOf  } from '../../../../kibana/packages/kbn-config-schema';

import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Logger,
} from '../../../../kibana/src/core/server';

import { registerRoutes } from './routes';
import { startDetective } from './detective';

export const config = {
  schema: schema.object({
    enabled: schema.boolean({ defaultValue: true }),

    // how often to check to see if the event loop is blocked
    interval: schema.number( { defaultValue: 10 }), // milliseconds

    // when the detected event loop block is longer than this, log a warning
    threshold: schema.number( { defaultValue: 200 }), // milliseconds
  })
}

type Config = TypeOf<typeof config.schema>;

export function plugin(initializerContext: PluginInitializerContext) {
  return new Plugin(initializerContext)
}

export class Plugin {
  readonly logger: Logger;
  readonly config$: PluginInitializerContext['config']

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get()
    this.config$ = initializerContext.config
  }

  async setup(core: CoreSetup) {
    const config = await this.getConfig()
    if (!config.enabled) return

    const router = core.http.createRouter();
    registerRoutes(this, router)
  }

  async start(core: CoreStart) {
    const config = await this.getConfig()
    if (!config.enabled) return

    this.logger.info(
      `starting detective on ${config.interval} ms interval for threshold ${config.threshold} ms`
    )

    startDetective({
      logger: this.logger,
      interval: config.interval,
      threshold: config.threshold,
    })
  }

  async stop() {
  }

  async getConfig() {
    return await this.config$
      .create<Config>()
      .pipe(first())
      .toPromise()
  }
}

