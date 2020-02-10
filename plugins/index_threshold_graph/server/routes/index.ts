import { IRouter } from '../../../../../kibana/src/core/server';
import { InternalService } from '../index';
import { createGraphSpecRoute } from './graph_spec';
import { createWebRoutes } from './web';

export const BaseRoute = '/_dev/index_threshold_graph';

export function registerRoutes(internalService: InternalService, router: IRouter): void {
  createGraphSpecRoute(internalService, router, BaseRoute);
  createWebRoutes(internalService, router, BaseRoute);
}
