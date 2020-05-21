import { IRouter } from '../../../../../kibana/src/core/server';
import { Plugin } from '../index';

import { registerRoute as registerRoute_POST_eat_cpu } from './POST_eat_cpu';

export function registerRoutes(plugin: Plugin, router: IRouter): void {
  registerRoute_POST_eat_cpu(plugin, router);
}
