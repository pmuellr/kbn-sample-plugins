
import { schema  } from '../../../../kibana/packages/kbn-config-schema';
import { PluginSetupContract as AlertingSetup } from '../../../../kibana/x-pack/plugins/alerting/server';
export { PluginSetupContract as AlertingSetup } from '../../../../kibana/x-pack/plugins/alerting/server';

import { alertType as alwaysFiringAlertType } from './alert_types/always_firing'
import { alertType as essqlAlertType } from './alert_types/essql'
import { alertType as fizzBuzzAlertType } from './alert_types/fizz_buzz'
import { alertType as heartBeatAlertType } from './alert_types/heartbeat'

import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Logger,
} from '../../../../kibana/src/core/server';

export const config = {
  schema: schema.object({
    enabled: schema.boolean({ defaultValue: true }),
  })
}

interface PluginDeps {
  alerting: AlertingSetup;
}

export function plugin(initializerContext: PluginInitializerContext) {
  return new Plugin(initializerContext)
}

export class Plugin {
  readonly logger: Logger;
  alerting: AlertingSetup;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get()
  }

  async setup(core: CoreSetup, plugins: PluginDeps): Promise<void> {
    this.alerting = plugins.alerting;

    this.registerAlertType(alwaysFiringAlertType)
    this.registerAlertType(essqlAlertType)
    this.registerAlertType(fizzBuzzAlertType)
    this.registerAlertType(heartBeatAlertType)
  }

  async start(core: CoreStart): Promise<void> {
  }

  async stop() {
  }

  private registerAlertType(alertType) {
    this.alerting.registerType(alertType)
    this.logger.info(`registered alert type: ${alertType.id}`)
  }
}
