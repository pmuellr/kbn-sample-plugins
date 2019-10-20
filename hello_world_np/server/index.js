// this doesn't work in a sym-link'd package
// import { schema } from '@kbn-config-schema';

// export const config = { schema: schema.object({}) }

export function plugin(initializerContext) {
  return new Plugin(initializerContext)
}

class Plugin {
  constructor(initializerContext) {
    this.logger = initializerContext.logger.get()
    this.logger.info('initializing!')
  }

  async setup(core, plugins) {
    this.logger.info('setting up!')
  }

  async start(core, plugins) {
    this.logger.info('starting!')
  }

  async stop() {
    this.logger.info('stopping!')
  }
}
