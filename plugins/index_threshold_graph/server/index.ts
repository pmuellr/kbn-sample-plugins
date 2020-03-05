export {
  PluginSetupContract as AlertingSetup,
  AlertType,
  AlertExecutorOptions,
} from '../../../../kibana/x-pack/plugins/alerting/server';

import { schema  } from '../../../../kibana/packages/kbn-config-schema';
import { IService as AlertingBuiltinsService } from '../../../../kibana/x-pack/plugins/alerting_builtins/server';

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
  alertingBuiltins?: AlertingBuiltinsService;
}

export function plugin(initializerContext: PluginInitializerContext) {
  return new Plugin(initializerContext)
}

export type Service = Plugin

export class Plugin {
  readonly logger: Logger;
  alertingBuiltins?: AlertingBuiltinsService;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get()
  }

  async setup(core: CoreSetup, plugins: PluginDeps): Promise<void> {
    this.alertingBuiltins = plugins.alertingBuiltins

    if (!this.alertingBuiltins) {
      this.logger.warn(`the alertingBuiltins plugin is not available, so this plugin will probably not work`)
    }
    const router = core.http.createRouter()
    registerRoutes(this, router)
  }

  async start(core: CoreStart): Promise<void> {
  }

  async stop() {
  }
}