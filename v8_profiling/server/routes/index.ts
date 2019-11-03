import { IRouter } from '../../../../src/core/server';
import { Plugin } from '../index';

import { registerRoute as registerRoute_GET_cpu_profile } from './GET_cpu_profile';

export function registerRoutes(router: IRouter, plugin: Plugin): void {
  registerRoute_GET_cpu_profile(router, plugin);
}
