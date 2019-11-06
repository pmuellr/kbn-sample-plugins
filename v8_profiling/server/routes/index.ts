import { IRouter } from '../../../../src/core/server';
import { Plugin } from '../index';

import { registerRoute as registerRoute_GET_cpu_profile } from './GET_cpu_profile';

export function registerRoutes(plugin: Plugin, router: IRouter): void {
  registerRoute_GET_cpu_profile(plugin, router);
}
