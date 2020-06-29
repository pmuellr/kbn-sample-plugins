import "abort-controller/polyfill"
import { first } from '../../../../kibana/node_modules/rxjs/operators';

import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Logger,
} from '../../../../kibana/src/core/server';

import { schema, TypeOf  } from '../../../../kibana/packages/kbn-config-schema';
import { ExpressionsService, ExpressionsServiceSetup, ExpressionsServiceStart } from '../../../../kibana/src/plugins/expressions';

import { registerRoutes } from './routes';
import { registerFunctions } from './functions';

export const config = {
  schema: schema.object({
    enabled: schema.boolean({ defaultValue: true }),
  })
}

type Config = TypeOf<typeof config.schema>;

export function plugin(initializerContext: PluginInitializerContext) {
  return new Plugin(initializerContext)
}

export interface ExpressionPlaygroundSetupDependencies {
  expressions: ExpressionsServiceSetup;
}

export interface ExpressionPlaygroundStarttDependencies {
  expressions: ExpressionsServiceStart;
}

export class Plugin {
  readonly logger: Logger;
  readonly config$: PluginInitializerContext['config']
  expService?: ExpressionsService;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get()
    this.config$ = initializerContext.config
  }

  async setup(core: CoreSetup, { expressions }: ExpressionPlaygroundSetupDependencies) {
    const config = await this.getConfig()
    if (!config.enabled) return

    const expService = this.expService = expressions.fork();
    const router = core.http.createRouter();
    registerFunctions({ plugin: this, expService });
    registerRoutes({ plugin: this, router, expService });
  }

  async start(core: CoreStart) {
    const config = await this.getConfig()
    if (!config.enabled) return
  }

  async stop() {
  }

  getExpressionService(): ExpressionsService {
    return this.expService
  }

  async getConfig() {
    return await this.config$
      .create<Config>()
      .pipe(first())
      .toPromise()
  }
}

