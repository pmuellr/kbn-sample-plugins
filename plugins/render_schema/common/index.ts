import { schema  } from '../../../../kibana/packages/kbn-config-schema';
import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Logger,
} from '../../../../kibana/src/core/server';
import { Service } from './service';
export { Service } from './service';

export const config = {
  schema: schema.object({
    enabled: schema.boolean({ defaultValue: true }),
  })
}

export function plugin(initializerContext: PluginInitializerContext) {
  return new Plugin(initializerContext)
}

class Plugin {
  readonly service: Service

  constructor(initializerContext: PluginInitializerContext) {
    const logger = initializerContext.logger.get()
    this.service = new Service(logger)
  }

  async setup(core: CoreSetup): Promise<Service> {
    return this.service;
  }

  async start(core: CoreStart): Promise<Service> {
    return this.service;
  }

  async stop() {
  }
}