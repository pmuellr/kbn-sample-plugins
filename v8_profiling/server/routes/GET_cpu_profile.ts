import {
  IRouter,
  RequestHandlerContext,
  KibanaRequest,
  KibanaResponseFactory,
} from '../../../../src/core/server';
import { Plugin } from '../index';

const routeConfig = {
  path: '/_dev/cpu_profile',
  validate: {
  },
};

export function registerRoute(router: IRouter, plugin: Plugin): void {
  plugin.logger.info(`registering route "${routeConfig.path}"`);
  router.get(routeConfig, async (
    context: RequestHandlerContext,
    request: KibanaRequest,
    response: KibanaResponseFactory,
  ) => {
    plugin.logger.info(`cpuProfile()`);
    
    return response.ok({ body: {} });
  });
}
