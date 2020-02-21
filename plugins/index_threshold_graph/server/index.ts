// /Users/pmuellr/Projects/elastic/kbn-sample-plugins/index_threshold_graph/server/index.ts
// /Users/pmuellr/Projects/elastic/kibana/plugins/index_threshold_graph/server/index.ts
// ../../../x-pack/plugins/alerting_index_threshold/server

// import { schema as brokenAtRuntime } from '@kbn/config-schema';

import { schema  } from '../../../../kibana/packages/kbn-config-schema';
import { IService as AITService } from '../../../../kibana/x-pack/plugins/alerting_builtins/server';
export { IService as AITService } from '../../../../kibana/x-pack/plugins/alerting_builtins/server';

import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Logger,
} from '../../../../kibana/src/core/server';

import { registerRoutes } from './routes/index';

export const config = {
  schema: schema.object({
    enabled: schema.boolean({ defaultValue: true }),
  })
}

interface PluginDeps {
  alertingIndexThreshold: AITService;
}

export function plugin(initializerContext: PluginInitializerContext) {
  return new Plugin(initializerContext)
}

export interface InternalService {
  logger: Logger;
  aitService: AITService;
}

export class Plugin {
  readonly logger: Logger;
  aitService: AITService;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get()
  }

  async setup(core: CoreSetup, plugins: PluginDeps): Promise<void> {
    this.aitService = plugins.alertingIndexThreshold;
    const router = core.http.createRouter();
    registerRoutes(this, router);
  }

  async start(core: CoreStart): Promise<void> {
  }

  async stop() {
  }
}